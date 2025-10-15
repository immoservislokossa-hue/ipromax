import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 📘 GET : Récupère tous les posts d’une catégorie donnée
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  // Étape 1️⃣ : récupérer la catégorie via son slug
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', params.slug)
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
    return NextResponse.json({ error: postsError.message }, { status: 500 })
  }

  // Réponse structurée
  return NextResponse.json({
    category,
    posts,
  })
}
