import { supabase } from '../config/supabase.js';

export const storeResume = async (user, file, parsedText, fileType) => {
  const userId = user.id;
  const originalName = file.originalname;
  // Generate safe filename (remove spaces/special chars)
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueId = crypto.randomUUID(); 
  const storagePath = `${userId}/${uniqueId}_${safeName}`;

  // 1. Upload to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from('resumes')
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (storageError) {
    console.error("Storage Error:", storageError);
    throw new Error("STORAGE_FAILED");
  }

  // 2. Set previous primary resumes to false
  await supabase
    .from('resumes')
    .update({ is_primary: false })
    .eq('user_id', userId)
    .eq('is_primary', true);

  // 3. Insert into Database
  const { data: dbData, error: dbError } = await supabase
    .from('resumes')
    .insert([{
      user_id: userId,
      original_filename: originalName,
      storage_path: storagePath,
      file_type: fileType,
      file_size: file.size,
      parsed_text: parsedText,
      is_primary: true
    }])
    .select()
    .single();

  if (dbError) {
    console.error("Database Insert Error:", dbError);
    // Attempt to rollback storage upload to prevent orphaned files
    await supabase.storage.from('resumes').remove([storagePath]);
    throw new Error("DATABASE_ERROR");
  }

  return dbData;
};

export const getCurrentResume = async (userId) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('id, original_filename, file_type, file_size, created_at, is_primary')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .single();

  // If no rows found, data is null, and error has code 'PGRST116'. We just return null.
  if (error && error.code !== 'PGRST116') {
    console.error("Database Fetch Error:", error);
    throw new Error("DATABASE_ERROR");
  }

  return data;
};

export const deleteResumeById = async (userId, resumeId) => {
  // First get the resume to find its storage path
  const { data: resume, error: fetchError } = await supabase
    .from('resumes')
    .select('storage_path')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !resume) {
    throw new Error("NOT_FOUND");
  }

  // Delete from Storage
  const { error: storageError } = await supabase.storage
    .from('resumes')
    .remove([resume.storage_path]);
    
  if (storageError) {
    console.error("Storage Delete Error:", storageError);
    // We continue anyway to ensure the DB record is deleted even if storage fails
  }

  // Delete from DB
  const { error: dbError } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId)
    .eq('user_id', userId);

  if (dbError) {
    console.error("Database Delete Error:", dbError);
    throw new Error("DATABASE_ERROR");
  }
};
