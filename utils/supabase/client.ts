import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vymqqyxhijdhawrzufbh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bXFxeXhoaWpkaGF3cnp1ZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQwMDYsImV4cCI6MjA3MzEyMDAwNn0.rchKWnebSZg2jDimhtAEEUiVkSPsmiDoCDJde5V0SXg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
