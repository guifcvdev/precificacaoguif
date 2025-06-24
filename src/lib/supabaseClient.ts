import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhtnzcvdstrtwicxdacl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodG56Y3Zkc3RydHdpY3hkYWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTMxMDAsImV4cCI6MjA2NjM2OTEwMH0.u99-K8ytUG03CjkRVpNawj8Sii58Ql-6hU5-d_tUNDA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 