import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs/route'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: posts, error } = await supabase
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
    .eq('category_slug', params.slug)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(posts)
}