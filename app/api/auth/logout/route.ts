import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: 'sb-access-token',
    value: '',
    path: '/',
    maxAge: 0,
  });
  res.cookies.set({
    name: 'sb-refresh-token',
    value: '',
    path: '/',
    maxAge: 0,
  });

  return res;
}
