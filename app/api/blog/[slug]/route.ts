import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/utils/supabase/server'
import DOMPurify from 'isomorphic-dompurify'

// Keep context untyped to avoid conflicts with Next.js generated route types
// (the build generates stricter param-check types; using `any` here prevents
// a TypeScript mismatch while preserving runtime behavior).

/**
 * 🧠 GET — Récupère un article via le slug
 */
export async function GET(request: Request, { params }: any) {
  try {
    const supabase = await createServerSupabaseClient()

    const slug = DOMPurify.sanitize(params.slug.toLowerCase())

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        published_at,
        updated_at,
        is_published,
        views,
        seo_title,
        seo_description,
        seo_keywords,
        authors (
          id,
          name,
          avatar,
          role
        ),
        blog_categories (
          id,
          name,
          slug,
          description
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Erreur Supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!post) {
      return NextResponse.json({ error: 'Post introuvable' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

/**
 * 🛠 PATCH — Met à jour un article (admin only)
 */
export async function PATCH(request: Request, { params }: any) {
  try {
    const supabase = await createServerSupabaseClient()

    // 🔐 Vérifie l’utilisateur
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    if (user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    // `let` for fields that will be reassigned during sanitization
    let { title, content, excerpt, seo_title, seo_description, seo_keywords } = body
    // `const` for fields not reassigned
    const { cover_image, category_id, is_published } = body

    // 🧼 Sanitize toutes les entrées
    title = DOMPurify.sanitize(title)
    content = DOMPurify.sanitize(content || '')
    excerpt = DOMPurify.sanitize(excerpt || '')
    seo_title = DOMPurify.sanitize(seo_title || '')
    seo_description = DOMPurify.sanitize(seo_description || '')
    seo_keywords = DOMPurify.sanitize(seo_keywords || '')

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title,
        content,
        excerpt,
        cover_image,
        category_id,
        is_published,
        seo_title,
        seo_description,
        seo_keywords,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', params.slug)
      .select()
      .single()

    if (error) {
      console.error('Erreur update:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

/**
 * 🗑 DELETE — Supprime un article (admin only)
 */
export async function DELETE(request: Request, { params }: any) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    if (user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { error } = await supabase.from('blog_posts').delete().eq('slug', params.slug)

    if (error) {
      console.error('Erreur delete:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Post supprimé avec succès' })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
