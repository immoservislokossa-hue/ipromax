import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs/route'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
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

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const json = await request.json()
  const { title, content, image_url, category_id } = json

  const { data, error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      image_url,
      category_id,
      updated_at: new Date().toISOString()
    })
    .eq('slug', params.slug)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

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