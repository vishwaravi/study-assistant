// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Your Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME || 'study-materials'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload file to Supabase storage
export const uploadFile = async (file, bucket = bucketName) => {
  try {
    console.log('Uploading to bucket:', bucket)
    console.log('File:', file.name)
    
    const fileName = `${Date.now()}_${file.name}`
    const filePath = `uploads/${fileName}`
    
    console.log('File path:', filePath)
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)
    
    if (error) {
      console.error('Upload error details:', error)
      throw error
    }
    
    console.log('Upload successful:', data)
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return {
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      filePath: filePath
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Helper function to delete file from Supabase storage
export const deleteFile = async (filePath, bucket = 'mybucket') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}
