import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const uploadToSupabase = async (file, bucket, filename) => {
  const fileExt = file.originalname.split('.').pop();
  const filePath = `${filename}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteFromSupabase = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Extract bucket and path from URL
    // URL format: https://bucket-name.s3.region.supabase.co/path/to/file
    const urlParts = fileUrl.split('/');
    const bucketName = urlParts[2].split('.')[0];
    const filePath = urlParts.slice(3).join('/');

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file from Supabase:', error);
    }
  } catch (error) {
    console.error('Error parsing Supabase URL:', error);
  }
};

export default supabase;
