import { createClient } from '@supabase/supabase-js'

// TODO: REPLACE THESE WITH YOUR ACTUAL CREDENTIALS FROM supabase.com
const supabaseUrl = https://vymqqyxhijdhawrzufbh.supabase.co
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bXFxeXhoaWpkaGF3cnp1ZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQwMDYsImV4cCI6MjA3MzEyMDAwNn0.rchKWnebSZg2jDimhtAEEUiVkSPsmiDoCDJde5V0SXg

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export const isSupabaseConfigured = () => {
  return !supabaseUrl.includes('your-project-ref') && !supabaseAnonKey.includes('your-anon-key')
}
