import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Cleans extracted text to normalize whitespace and remove artifacts.
 */
const cleanText = (text) => {
  if (!text) return "";

  // 1. Replace multiple spaces with a single space
  // 2. Replace multiple newlines with a double newline to preserve section breaks
  // 3. Trim leading and trailing whitespace
  let cleaned = text
    .replace(/[ \t]+/g, ' ')           // Normalize spaces/tabs
    .replace(/\n{3,}/g, '\n\n')        // Max 2 newlines (paragraph breaks)
    .trim();

  return cleaned;
};

/**
 * Parses resume file buffer based on its mimetype.
 * Returns { text, fileType } or throws an error.
 */
export const parseResume = async (file) => {
  let rawText = "";
  let fileType = "";

  try {
    if (file.mimetype === 'application/pdf') {
      fileType = 'pdf';
      const data = await pdfParse(file.buffer);
      rawText = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileType = 'docx';
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      rawText = result.value;
    } else {
      throw new Error("INVALID_FILE_TYPE");
    }

    const cleanedText = cleanText(rawText);

    // Validate that we actually got some text (avoids scanned PDFs returning nothing)
    if (cleanedText.length < 50) {
      throw new Error("EMPTY_RESUME");
    }

    return {
      text: cleanedText,
      fileType
    };

  } catch (error) {
    if (error.message === "EMPTY_RESUME") {
      throw error; // Let the caller handle this specific error
    }
    console.error("Parser Error:", error);
    throw new Error("RESUME_PARSE_FAILED");
  }
};
