import { createServerSupabaseClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import DOMPurify from 'isomorphic-dompurify'

// 📘 GET : Récupère toutes les catégories
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, created_at, updated_at')
      .order('name', { ascending: true })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

// 🧩 POST : Crée une nouvelle catégorie (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    // 🔐 Vérification d’authentification
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // 🔒 Vérifie que c’est l’admin
    if (user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    let { name, slug, description } = body

    // 🧼 Nettoyage anti-XSS
    name = DOMPurify.sanitize(name)
    slug = DOMPurify.sanitize(slug.toLowerCase().replace(/\s+/g, '-'))
    description = DOMPurify.sanitize(description || '')

    // ✅ Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Les champs "name" et "slug" sont obligatoires.' },
        { status: 400 }
      )
    }

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
      console.error('Erreur création catégorie:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug déjà existant' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
