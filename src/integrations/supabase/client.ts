import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hhcnnpnfuuyocatanfuo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY25ucG5mdXV5b2NhdGFuZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjE1MzksImV4cCI6MjA1MDUzNzUzOX0.1gici0a2emjvMxOU15hXH1TS16Sea1Ys-JfWa6JMLUc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);