import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client. Use only server-safe env vars.
export const createServerSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
};
