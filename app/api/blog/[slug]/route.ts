import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 🧩 GET: Récupère un post unique selon le slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      content,
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
    .eq('slug', params.slug)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}

// 🧩 PATCH: Met à jour un post
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()
  const { title, content, image_url, category_id } = body

  const { data, error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      image_url,
      category_id,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', params.slug)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 🧩 DELETE: Supprime un post
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('slug', params.slug)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Post deleted successfully' })
}
