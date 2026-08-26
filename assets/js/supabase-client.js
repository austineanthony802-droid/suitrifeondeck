// Supabase connection setup — shared across all pages
const SUPABASE_URL = "https://vxxslqhaxgyixxmlonza.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eHNscWhheGd5aXh4bWxvbnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNTI5MjUsImV4cCI6MjEwMTgyODkyNX0.h_Ev3J8_A1VrDby5K9y-W1fktfFPVIK6_WHJiotegLc";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);