// utils/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * ✅ Client Supabase côté client
 * À utiliser dans les composants React avec "use client"
 */
export const createClient = () => {
  return createClientComponentClient();
};
