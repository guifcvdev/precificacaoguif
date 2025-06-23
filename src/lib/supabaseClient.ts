import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmpzpwpmlbpzrqdhbayn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcHpwd3BtbGJwenJxZGhiYXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODYwMjcsImV4cCI6MjA2NjI2MjAyN30.zr8ch7cRJXKE94wjMI5HneetRnzWla1dEaIYuRKEFNQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 