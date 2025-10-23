'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import ProductGrid from '@/components/Produits/ProductGrid';
import SearchFilters from '@/components/header/SearchFilters';
import DOMPurify from 'dompurify';


// ✅ Interface produit alignée sur ta table Supabase "Propulser"
export interface Product {
  slug: string;
  name: string;
  description?: string;
  detailed_description?: string;
  price?: number;
  original_price?: number;
  rating?: number;
  purchase_count?: number;
  image?: string;
  gallery?: string[];
  category?: string;
  brand?: string;
  features?: string;
  benefits?: string;
  delivery_info?: string;
  promo?: boolean;
  is_new?: boolean;
  is_luxury?: boolean;
  instock?: boolean;
  order_link?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 États de recherche et filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 🚀 Charger les produits depuis Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('Propulser')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // 🧼 Sanitize et map des données
        const mapped = (data || []).map((p: any) => ({
          ...p,
          name: DOMPurify.sanitize(p.name || ''),
          description: DOMPurify.sanitize(p.description || ''),
          category: DOMPurify.sanitize(p.category || ''),
          brand: DOMPurify.sanitize(p.brand || ''),
          features: DOMPurify.sanitize(p.features || ''),
          benefits: DOMPurify.sanitize(p.benefits || ''),
        }));

        setProducts(mapped);
      } catch (err) {
        console.error('Erreur produits:', err);
        setError('❌ Impossible de récupérer les produits pour le moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  // 🔎 Application des filtres
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = searchTerm
      ? [p.name, p.description, p.category, p.brand]
          .filter(Boolean)
          .some((field) =>
            field!.toLowerCase().includes(searchTerm.toLowerCase())
          )
      : true;
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  // ⚠️ Gestion des erreurs
  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // 🎨 Rendu principal
  return (
    <div className=" min-h-screen text-gray-900">
      {/* SEO principal */}
      <h1 className="sr-only">
        Boutique Propulser — formations, outils digitaux et produits premium
      </h1>

      {/* 🔍 Barre de recherche */}
      <div className="container mx-auto py-8 px-4">
        <SearchFilters
          onSearch={setSearchTerm}
          onCategorySelect={setSelectedCategory}
          categories={categories}
          
          searchTerm={searchTerm}
        />
      </div>

      {/* 🛍️ Section Produits */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          {selectedCategory || 'Toutes nos offres digitales'}{' '}
          {searchTerm && (
            <span className="text-gray-500 text-lg font-normal">
              — Résultats pour “{searchTerm}”
            </span>
          )}
        </h2>

        {loading ? (
          // 💨 Skeleton Loader
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          // 🚫 Aucun produit trouvé
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              Aucun produit trouvé. Essayez un autre mot-clé ou explorez nos catégories :
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // ✅ Grille des produits
          <ProductGrid products={filteredProducts} />
        )}
      </div>

    </div>
  );
}
