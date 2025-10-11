declare module '@supabase/auth-helpers-nextjs' {
  import { SupabaseClient } from '@supabase/supabase-js';
  import { NextRequest, NextResponse } from 'next/server';

  export function createMiddlewareClient(opts: { req: NextRequest; res: NextResponse }): SupabaseClient;
  export function createClientComponentClient(): SupabaseClient;
}
