import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nszmrxqmwtrcklfymuxa.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zem1yeHFtd3RyY2tsZnltdXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NDc0MjQsImV4cCI6MjEwODMyMzQyNH0.quPCzf9SrMC3Fl7Qc76EsYIeglAjOOQ8-hvoKyx_LCs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);