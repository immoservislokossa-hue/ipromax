import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 📘 GET : Récupère toutes les catégories
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, created_at, updated_at')
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(categories)
}

// 🧩 POST : Crée une nouvelle catégorie
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()
  const { name, slug, description } = body

  // ✅ Validation de base
  if (!name || !slug) {
    return NextResponse.json(
      { error: 'Les champs "name" et "slug" sont obligatoires.' },
      { status: 400 }
    )
  }

  // ✅ Insertion dans la table "categories"
  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        name,
        slug,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
