import { generateAndSaveRoadmap, getRoadmapById, getCurrentRoadmap, toggleTaskCompletion } from '../services/roadmapService.js';

export const createRoadmap = async (req, res) => {
  try {
    const { analysisId, durationWeeks = 6, hoursPerWeek = 10, goal = 'balanced' } = req.body;
    const user = req.user;

    if (!analysisId) {
      return res.status(400).json({ success: false, error: { message: 'analysisId is required.' } });
    }

    if (durationWeeks < 2 || durationWeeks > 12 || hoursPerWeek < 3 || hoursPerWeek > 30) {
      return res.status(400).json({ success: false, error: { message: 'Invalid duration or hours per week.' } });
    }

    const validGoals = ['interview_ready', 'resume_fit', 'skill_gaps', 'balanced'];
    if (!validGoals.includes(goal)) {
      return res.status(400).json({ success: false, error: { message: 'Invalid goal.' } });
    }

    const roadmap = await generateAndSaveRoadmap(user.id, analysisId, durationWeeks, hoursPerWeek, goal);

    return res.status(201).json({ success: true, roadmap });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED_OR_NOT_FOUND') {
      return res.status(404).json({ success: false, error: { message: 'Analysis not found or unauthorized.' } });
    }
    console.error("Create Roadmap Error:", error);
    return res.status(500).json({ success: false, error: { message: 'Failed to generate roadmap.' } });
  }
};

export const getRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    // Support the /api/roadmaps/current route logic directly here if 'id' is 'current'
    // But typically it's better mapped explicitly in routes.
    
    const roadmap = await getRoadmapById(user.id, id);
    return res.status(200).json({ success: true, roadmap });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, error: { message: 'Roadmap not found.' } });
    }
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch roadmap.' } });
  }
};

export const getCurrent = async (req, res) => {
  try {
    const user = req.user;
    const roadmap = await getCurrentRoadmap(user.id);
    
    return res.status(200).json({ success: true, roadmap });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch current roadmap.' } });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { roadmapId, taskId } = req.params;
    const { completed } = req.body;
    const user = req.user;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ success: false, error: { message: 'completed boolean is required.' } });
    }

    const result = await toggleTaskCompletion(user.id, roadmapId, taskId, completed);

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: 'Failed to update task.' } });
  }
};
