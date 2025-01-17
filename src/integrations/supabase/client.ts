import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);