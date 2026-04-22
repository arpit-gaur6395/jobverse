import { createClient } from '@supabase/supabase-js';

let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }
  return supabase;
};

export const uploadToSupabase = async (file, bucket, filename) => {
  const client = getSupabaseClient();
  const fileExt = file.originalname.split('.').pop();
  const filePath = `${filename}.${fileExt}`;

  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = client.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteFromSupabase = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const client = getSupabaseClient();
    // Extract bucket and path from URL
    // URL format: https://bucket-name.s3.region.supabase.co/path/to/file
    const urlParts = fileUrl.split('/');
    const bucketName = urlParts[2].split('.')[0];
    const filePath = urlParts.slice(3).join('/');

    const { error } = await client.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file from Supabase:', error);
    }
  } catch (error) {
    console.error('Error parsing Supabase URL:', error);
  }
};

export default getSupabaseClient;
