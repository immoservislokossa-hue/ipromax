import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs/route'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const json = await request.json()
  const { title, content, slug, image_url, author_id, category_id } = json

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        content,
        slug,
        image_url,
        author_id,
        category_id
      }
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}