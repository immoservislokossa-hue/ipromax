import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 📘 GET : Récupérer tous les posts du blog
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      image_url,
      created_at,
      updated_at,
      categories (
        name,
        slug
      ),
      authors (
        name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(posts)
}

// 🧩 POST : Créer un nouveau post
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()
  const { title, content, slug, image_url, author_id, category_id } = body

  if (!title || !slug || !author_id || !category_id) {
    return NextResponse.json(
      { error: 'Champs requis manquants : title, slug, author_id, category_id' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        content,
        slug,
        image_url,
        author_id,
        category_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
