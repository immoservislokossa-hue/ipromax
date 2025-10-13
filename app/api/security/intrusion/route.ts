import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseKey = supabaseServiceRole ?? supabaseAnonKey;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ip, userAgent, reason } = body || {};

    // Simple rate-limit / tracking: write to intrusion_logs table if exists
    try {
      await supabase.from('intrusion_logs').insert([{ ip: ip || null, user_agent: userAgent || null, reason: reason || null, created_at: new Date().toISOString() }]);
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
