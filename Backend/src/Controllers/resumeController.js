import { parseResume } from '../services/resumeParser.js';
import { storeResume, getCurrentResume as fetchCurrentResume, deleteResumeById } from '../services/resumeService.js';

export const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No resume file provided.' }
      });
    }

    // 1. Parse the resume to extract text
    const { text, fileType } = await parseResume(file);

    // 2. Store file in Supabase Storage & DB
    const dbResume = await storeResume(user, file, text, fileType);

    // 3. Return structured response (excluding parsed_text for performance/security)
    return res.status(201).json({
      success: true,
      resume: {
        id: dbResume.id,
        filename: dbResume.original_filename,
        fileType: dbResume.file_type,
        fileSize: dbResume.file_size,
        isPrimary: dbResume.is_primary,
        createdAt: dbResume.created_at
      }
    });

  } catch (error) {
    const errorMap = {
      "INVALID_FILE_TYPE": { status: 400, message: "Only PDF and DOCX resumes are supported." },
      "EMPTY_RESUME": { status: 400, message: "We couldn't extract readable text from this resume. Please upload a text-based PDF or DOCX." },
      "RESUME_PARSE_FAILED": { status: 500, message: "Failed to parse the resume file." },
      "STORAGE_FAILED": { status: 500, message: "Failed to upload resume to storage." },
      "DATABASE_ERROR": { status: 500, message: "Failed to save resume metadata to database." }
    };

    const mappedError = errorMap[error.message];
    if (mappedError) {
      return res.status(mappedError.status).json({
        success: false,
        error: { code: error.message, message: mappedError.message }
      });
    }

    console.error("Unexpected Upload Error:", error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_FAILED', message: 'An unexpected error occurred during upload.' }
    });
  }
};

export const getCurrentResume = async (req, res) => {
  try {
    const user = req.user;
    const resume = await fetchCurrentResume(user.id);

    if (!resume) {
      return res.status(200).json({ success: true, resume: null });
    }

    return res.status(200).json({
      success: true,
      resume: {
        id: resume.id,
        filename: resume.original_filename,
        fileType: resume.file_type,
        fileSize: resume.file_size,
        uploadedAt: resume.created_at,
        isPrimary: resume.is_primary
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to fetch current resume.' }
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    
    await deleteResumeById(user.id, id);
    
    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resume not found or unauthorized.' }
      });
    }
    return res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to delete resume.' }
    });
  }
};
