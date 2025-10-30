import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wasjftuxmdwzrwjpykre.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2pmdHV4bWR3enJ3anB5a3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTcyNzEsImV4cCI6MjA3NzM5MzI3MX0.nEqHOInIc9TkWyaKP8LpkTzOCe-KhZNikEdTtiZLQv8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
