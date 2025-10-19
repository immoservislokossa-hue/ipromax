// app/blog/categorie/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Folder,
  ArrowRight,
  BookOpen,
  Hash
} from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";

// Image Unsplash de fallback pour les couvertures
const UNSPLASH_CATEGORY_FALLBACK = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";

interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  post_count: number;
}

// --- Composant Carte de Catégorie Minimaliste
function CategoryCard({ category }: { category: Category }) {
  return (
    <Link 
      href={`/blog/categorie/${category.slug}`}
      className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <Folder className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {category.post_count} article{category.post_count !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={18} />
      </div>

      {category.description && (
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {category.description}
        </p>
      )}
    </Link>
  );
}

// --- Composant principal
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient();
        
        // Récupérer les catégories avec le compte d'articles publiés
        const { data: categories, error } = await supabase
          .from('blog_categories')
          .select(`
            id,
            slug,
            name,
            description,
            blog_posts!inner(
              id
            )
          `)
          .eq('blog_posts.is_published', true);

        if (error) {
          console.error('Erreur récupération catégories:', error);
          return;
        }

        // Transformer les données
        const transformedCategories = categories?.map(cat => ({
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          post_count: Array.isArray(cat.blog_posts) ? cat.blog_posts.length : 0
        })) || [];

        // Trier par nombre d'articles (décroissant)
        const sortedCategories = transformedCategories.sort((a, b) => b.post_count - a.post_count);
        setCategories(sortedCategories);

      } catch (error) {
        console.error('Erreur fetchCategories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* En-tête skeleton */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gray-200 animate-pulse px-4 py-2 rounded-full text-sm font-medium mb-6 w-24 h-6"></div>
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-6 max-w-md mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto"></div>
          </header>

          {/* Statistiques skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-8 py-6 shadow-sm border border-gray-200 animate-pulse">
              <div>
                <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>

          {/* Grille des catégories skeleton */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
                      <div>
                        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-blue-800 bg-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Hash size={16} />
            Catégories
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explorer par thème
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos articles organisés par catégorie. 
            Trouvez facilement le contenu qui vous intéresse.
          </p>
        </header>

        {/* Statistiques globales */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-8 py-6 shadow-sm border border-gray-200">
            <div>
              <span className="block text-3xl font-bold text-gray-900">{categories.length}</span>
              <span className="text-sm text-gray-600">Catégories</span>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <span className="block text-3xl font-bold text-gray-900">
                {categories.reduce((total, cat) => total + cat.post_count, 0)}
              </span>
              <span className="text-sm text-gray-600">Articles au total</span>
            </div>
          </div>
        </div>

        {/* Grille des catégories */}
        <section className="mb-16">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            // État vide
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune catégorie pour le moment
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Les catégories seront bientôt disponibles.
              </p>
            </div>
          )}
        </section>

        {/* Navigation alternative */}
        <section className="text-center border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vous ne trouvez pas votre bonheur ?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Parcourez tous nos articles sans filtre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen size={16} />
              Voir tous les articles
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}