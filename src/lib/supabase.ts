import { createClient } from '@supabase/supabase-js'

// Use your actual Supabase URL and anon key
const supabaseUrl = https://vymqqyxhijdhawrzufbh.supabase.co  // Replace with your actual URL
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bXFxeXhoaWpkaGF3cnp1ZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQwMDYsImV4cCI6MjA3MzEyMDAwNn0.rchKWnebSZg2jDimhtAEEUiVkSPsmiDoCDJde5V0SXg  // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we have real credentials
export const isSupabaseConfigured = () => {
  return !supabaseUrl.includes(https://vymqqyxhijdhawrzufbh.supabase.co) && !supabaseAnonKey.includes(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bXFxeXhoaWpkaGF3cnp1ZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQwMDYsImV4cCI6MjA3MzEyMDAwNn0.rchKWnebSZg2jDimhtAEEUiVkSPsmiDoCDJde5V0SXg)
}
