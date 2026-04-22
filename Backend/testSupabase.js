import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  console.log('URL:', process.env.SUPABASE_URL);
  console.log('Key:', process.env.SUPABASE_ANON_KEY ? 'Present' : 'Missing');

  try {
    // Test 1: Check if we can list buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase!');
    console.log('Available buckets:', buckets.map(b => b.name));

    // Test 2: Check if required buckets exist
    const bucketNames = buckets.map(b => b.name);
    if (!bucketNames.includes('resumes')) {
      console.warn('⚠️  Warning: "resumes" bucket not found. Create it in Supabase dashboard.');
    }
    if (!bucketNames.includes('photos')) {
      console.warn('⚠️  Warning: "photos" bucket not found. Create it in Supabase dashboard.');
    }

    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
}

testSupabase();
