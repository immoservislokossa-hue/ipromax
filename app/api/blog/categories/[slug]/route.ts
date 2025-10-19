import { createServerSupabaseClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import DOMPurify from 'isomorphic-dompurify'

// 📘 GET : Récupère tous les posts d’une catégorie donnée
export async function GET(request: Request, { params }: any) {
  try {
    const supabase = await createServerSupabaseClient()

    // 🧼 Sécurisation du slug reçu dans l’URL
    const slug = DOMPurify.sanitize(params.slug.toLowerCase())

    // Étape 1️⃣ : récupérer la catégorie via son slug
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('slug', slug)
      .single()

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    // Étape 2️⃣ : récupérer les posts liés à cette catégorie
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        image_url,
        created_at,
        authors (
          name,
          avatar_url
        ),
        categories (
          name,
          slug
        )
      `)
      .eq('category_id', category.id)
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Erreur chargement posts:', postsError)
      return NextResponse.json(
        { error: postsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ category, posts })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
