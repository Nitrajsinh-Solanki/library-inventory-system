// library-inventory-system\src\lib\supabase\storage.ts

import { supabaseAdmin } from './server-client';

/**
 * Extracts the file path from a Supabase URL
 * @param url The full Supabase URL
 * @returns The file path relative to the bucket
 */
export function getFilePathFromUrl(url: string): string | null {
  try {
    // Extract the path after the bucket name
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'for-hackathon';
    const regex = new RegExp(`${bucketName}/([^?]+)`);
    const match = url.match(regex);
    
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting file path:', error);
    return null;
  }
}

/**
 * Deletes a file from Supabase storage
 * @param url The full Supabase URL of the file to delete
 * @returns Boolean indicating success
 */
export async function deleteFileFromSupabase(url: string): Promise<boolean> {
  try {
    if (!url) return true; // No file to delete
    
    const filePath = getFilePathFromUrl(url);
    if (!filePath) return false;
    
    const { error } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'for-hackathon')
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file from Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFileFromSupabase:', error);
    return false;
  }
}
