import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs/route'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const json = await request.json()
  const { name, slug, description } = json

  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        name,
        slug,
        description
      }
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}