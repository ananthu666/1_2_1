
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ljjlfnnrmqxiuhqzejzo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqamxmbm5ybXF4aXVocXplanpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NzMxMTMsImV4cCI6MjAyNTE0OTExM30.BC1YBNS7Gwe2rhdjUH4Bsphc1OJyhTNzYZBiJRBnUs8'
const supabase = createClient(supabaseUrl, supabaseKey)
// console.log(supabase);
export default supabase;