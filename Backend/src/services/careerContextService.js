import { supabase } from '../config/supabase.js';

/**
 * Builds the career context for a user to be sent to the AI consultant.
 * Retrieves only necessary data to avoid sending massive payloads.
 */
export const buildCareerContext = async (userId, options = {}) => {
  const { analysisId, roadmapId } = options;

  const context = {
    resume: { available: false },
    analysis: { available: false },
    roadmap: { available: false },
  };

  try {
    // 1. Fetch Resume Context
    // We get the user's primary resume. We'll extract skills and basic info.
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('parsed_text')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (!resumeError && resume && resume.parsed_text) {
      context.resume = {
        available: true,
        content: resume.parsed_text
      };
    }

    // 2. Fetch Analysis Context
    let analysisQuery = supabase
      .from('analyses')
      .select('job_title, company, match_score, missing_skills, partial_skills, strengths, recommendations')
      .eq('user_id', userId);

    if (analysisId) {
      analysisQuery = analysisQuery.eq('id', analysisId);
    } else {
      analysisQuery = analysisQuery.order('created_at', { ascending: false }).limit(1);
    }

    const { data: analyses, error: analysisError } = await analysisQuery;

    if (!analysisError && analyses && analyses.length > 0) {
      const activeAnalysis = analyses[0];
      context.analysis = {
        available: true,
        jobTitle: activeAnalysis.job_title,
        company: activeAnalysis.company,
        matchScore: activeAnalysis.match_score,
        missingSkills: activeAnalysis.missing_skills,
        partialSkills: activeAnalysis.partial_skills,
        strengths: activeAnalysis.strengths,
        recommendations: activeAnalysis.recommendations
      };
    }

    // 3. Fetch Roadmap Context
    let roadmapQuery = supabase
      .from('roadmaps')
      .select('id, target_role, duration_weeks, weekly_commitment_hours, weeks')
      .eq('user_id', userId);

    if (roadmapId) {
      roadmapQuery = roadmapQuery.eq('id', roadmapId);
    } else {
      roadmapQuery = roadmapQuery.order('created_at', { ascending: false }).limit(1);
    }

    const { data: roadmaps, error: roadmapError } = await roadmapQuery;

    if (!roadmapError && roadmaps && roadmaps.length > 0) {
      const activeRoadmap = roadmaps[0];
      
      const simplifiedWeeks = activeRoadmap.weeks.map(w => ({
        week: w.week,
        focus: w.focus,
        tasks: w.tasks.map(t => t.title)
      }));

      context.roadmap = {
        available: true,
        targetRole: activeRoadmap.target_role,
        durationWeeks: activeRoadmap.duration_weeks,
        weeks: simplifiedWeeks
      };
    }

  } catch (error) {
    console.error("Error building career context:", error);
  }

  return context;
};
