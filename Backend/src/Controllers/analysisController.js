import { generateAndSaveAnalysis, getAnalysisById, getAllAnalyses } from '../services/analysisService.js';

export const generateAnalysis = async (req, res) => {
  try {
    const { resumeId, jobTitle, company, jobDescription } = req.body;
    const user = req.user;

    if (!resumeId || !jobTitle || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'resumeId, jobTitle, and jobDescription are required.' }
      });
    }

    if (jobDescription.length < 50 || jobDescription.length > 5000) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_LENGTH', message: 'jobDescription must be between 50 and 5000 characters.' }
      });
    }

    const analysis = await generateAndSaveAnalysis(user.id, resumeId, jobTitle, company, jobDescription);

    return res.status(201).json({
      success: true,
      analysis
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED_OR_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resume not found or access denied.' }
      });
    }
    if (error.message === 'EMPTY_RESUME_TEXT') {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Resume contains no readable text.' }
      });
    }
    
    console.error("Generate Analysis Controller Error:", error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to generate analysis.' }
    });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const analysis = await getAnalysisById(user.id, id);

    return res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Analysis not found.' }
      });
    }
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve analysis.' }
    });
  }
};

export const getAnalyses = async (req, res) => {
  try {
    const user = req.user;
    const analyses = await getAllAnalyses(user.id);

    return res.status(200).json({
      success: true,
      analyses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve analyses.' }
    });
  }
};
