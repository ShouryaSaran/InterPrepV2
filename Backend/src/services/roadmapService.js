import { supabase } from '../config/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ROADMAP_SYSTEM_PROMPT, buildRoadmapUserPrompt } from '../prompts/careerRoadmapPrompt.js';

export const generateAndSaveRoadmap = async (userId, analysisId, durationWeeks, hoursPerWeek, goal) => {
  // 1. Verify Analysis Ownership
  const { data: analysis, error: fetchError } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !analysis) {
    throw new Error("UNAUTHORIZED_OR_NOT_FOUND");
  }

  // 2. Prevent Duplicate Roadmaps for the same analysis
  const { data: existingRoadmap } = await supabase
    .from('roadmaps')
    .select('id')
    .eq('analysis_id', analysisId)
    .eq('user_id', userId)
    .single();

  if (existingRoadmap) {
    return existingRoadmap; // Return existing if already generated
  }

  // 3. Call Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: ROADMAP_SYSTEM_PROMPT });
  const prompt = buildRoadmapUserPrompt(analysis, durationWeeks, hoursPerWeek, goal);

  let roadmapData;
  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) {
      text = text.substring(7);
      if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    } else if (text.startsWith('```')) {
      text = text.substring(3);
      if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    }
    roadmapData = JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Roadmap Error:", error);
    throw new Error("FAILED_AI_GENERATION");
  }

  // Validate basic schema structure
  if (!roadmapData.weeks || !Array.isArray(roadmapData.weeks)) {
    throw new Error("MALFORMED_ROADMAP_JSON");
  }

  // Calculate total tasks
  let totalTasks = 0;
  roadmapData.weeks.forEach(w => {
    if (w.tasks && Array.isArray(w.tasks)) {
      totalTasks += w.tasks.length;
    }
  });

  // 4. Save to `roadmaps` table
  const { data: dbRoadmap, error: insertError } = await supabase
    .from('roadmaps')
    .insert([{
      user_id: userId,
      analysis_id: analysisId,
      title: roadmapData.title,
      duration_weeks: durationWeeks,
      hours_per_week: hoursPerWeek,
      goal: goal,
      summary: roadmapData.summary,
      estimated_readiness: roadmapData.estimatedReadinessAfterCompletion,
      roadmap_data: roadmapData, // store the JSON struct here for reference (focus areas, milestones)
      total_tasks: totalTasks,
      completed_tasks: 0,
      status: 'active'
    }])
    .select()
    .single();

  if (insertError) {
    console.error("Roadmap Insert Error:", insertError);
    throw new Error("DATABASE_ERROR");
  }

  // 5. Save to `roadmap_tasks` table
  const taskInserts = [];
  let sortOrder = 0;
  roadmapData.weeks.forEach(week => {
    if (week.tasks) {
      week.tasks.forEach(task => {
        taskInserts.push({
          roadmap_id: dbRoadmap.id,
          user_id: userId,
          week_number: week.week,
          title: task.title,
          description: task.description,
          category: task.category,
          skill: task.skill,
          priority: task.priority,
          estimated_hours: task.estimatedHours,
          deliverable: task.deliverable,
          reason: task.reason,
          sort_order: sortOrder++
        });
      });
    }
  });

  if (taskInserts.length > 0) {
    const { error: taskInsertError } = await supabase
      .from('roadmap_tasks')
      .insert(taskInserts);
    
    if (taskInsertError) {
      console.error("Roadmap Tasks Insert Error:", taskInsertError);
      // We don't rollback the roadmap here to simplify, but in a real app we'd use a transaction or rollback
    }
  }

  return dbRoadmap;
};

export const getRoadmapById = async (userId, roadmapId) => {
  const { data: roadmap, error: roadmapError } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', roadmapId)
    .eq('user_id', userId)
    .single();

  if (roadmapError) throw new Error("NOT_FOUND");

  const { data: tasks, error: tasksError } = await supabase
    .from('roadmap_tasks')
    .select('*')
    .eq('roadmap_id', roadmapId)
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  if (tasksError) throw new Error("DATABASE_ERROR");

  return { ...roadmap, tasks };
};

export const getCurrentRoadmap = async (userId) => {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('id, title, duration_weeks, total_tasks, completed_tasks, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code === 'PGRST116') {
    return null; // Not found
  }
  if (error) throw new Error("DATABASE_ERROR");
  
  return data;
};

export const toggleTaskCompletion = async (userId, roadmapId, taskId, completed) => {
  // 1. Update the task
  const { error: taskError } = await supabase
    .from('roadmap_tasks')
    .update({ 
      completed, 
      completed_at: completed ? new Date().toISOString() : null 
    })
    .eq('id', taskId)
    .eq('roadmap_id', roadmapId)
    .eq('user_id', userId);

  if (taskError) throw new Error("DATABASE_ERROR");

  // 2. Recalculate completed_tasks for the roadmap
  const { count, error: countError } = await supabase
    .from('roadmap_tasks')
    .select('id', { count: 'exact', head: true })
    .eq('roadmap_id', roadmapId)
    .eq('completed', true);

  if (countError) throw new Error("DATABASE_ERROR");

  // 3. Update roadmap total & status
  // Also check if we need to set status to 'completed'
  const { data: roadmap, error: fetchError } = await supabase
    .from('roadmaps')
    .select('total_tasks')
    .eq('id', roadmapId)
    .single();

  const newStatus = (count >= roadmap.total_tasks) ? 'completed' : 'active';

  const { error: updateError } = await supabase
    .from('roadmaps')
    .update({ completed_tasks: count, status: newStatus })
    .eq('id', roadmapId);

  if (updateError) throw new Error("DATABASE_ERROR");

  return { completed_tasks: count, status: newStatus };
};
