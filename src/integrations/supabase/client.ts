import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY25ucG5mdXV5b2NhdGFuZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NzI0MDAsImV4cCI6MTcxMDg3NjAwMH0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);