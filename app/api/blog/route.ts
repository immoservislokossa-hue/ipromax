import { createServerSupabaseClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import DOMPurify from 'isomorphic-dompurify' // 🛡️ Anti-XSS

// 📘 GET : Récupérer tous les posts du blog
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image,
        created_at,
        updated_at,
        published_at,
        is_published,
        views,
        blog_categories (
          name,
          slug
        ),
        authors (
          name,
          avatar
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

// 🧩 POST : Créer un nouveau post (avec authentification + validation stricte)
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    // 🔐 Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // 🧱 Vérifier que l’utilisateur est bien l’administrateur
    if (user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès réservé à l’administrateur' }, { status: 403 })
    }

  const body = await request.json()
  // Seuls les champs qui seront réassignés (sanitization) doivent être `let`
  let { title, content, slug, excerpt } = body
  // Les autres valeurs qui ne sont pas réassignées peuvent être const
  const { cover_image, author_id, category_id } = body

    // 🧼 Nettoyage anti-injection / anti-XSS
  title = DOMPurify.sanitize(title)
  content = DOMPurify.sanitize(content || '')
  excerpt = DOMPurify.sanitize(excerpt || '')
  slug = DOMPurify.sanitize(slug?.toLowerCase().replace(/\s+/g, '-'))

    // 🧩 Validation des champs
    if (!title || !slug || !author_id || !category_id) {
      return NextResponse.json(
        { error: 'Champs requis manquants : title, slug, author_id, category_id' },
        { status: 400 }
      )
    }

    if (title.length < 3 || slug.length < 3) {
      return NextResponse.json(
        { error: 'Le titre et le slug doivent contenir au moins 3 caractères' },
        { status: 400 }
      )
    }

    // 🗄️ Insertion sécurisée
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title,
          content,
          slug,
          cover_image: cover_image || null,
          author_id,
          category_id,
          excerpt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_published: false,
        },
      ])
      .select(`
        *,
        blog_categories ( name, slug ),
        authors ( name, avatar )
      `)
      .single()

    if (error) {
      console.error('Erreur création post:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Un post avec ce slug existe déjà' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
