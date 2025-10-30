import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wasjftuxmdwzrwjpykre.supabase.co'
// Using service role key to bypass RLS
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2pmdHV4bWR3enJ3anB5a3JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgxNzI3MSwiZXhwIjoyMDc3MzkzMjcxfQ.aSCkAeRzcVewB5VhMUzW5vJntfnlEZ9CvYGmb871udo'

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
