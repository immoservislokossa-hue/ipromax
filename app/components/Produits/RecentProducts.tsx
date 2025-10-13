'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProductGrid from './ProductGrid';
import { Product } from './ProductCard';

export default function RecentProducts() {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 🔹 Lecture directe depuis ta table Propulser
        const { data, error } = await supabase
          .from('Propulser')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-12">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-xl bg-gradient-to-r from-blue-100 via-blue-50 to-gray-100 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        Aucun produit trouvé pour le moment.
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-900">
          Nos <span className="text-blue-600">Nouveautés</span>
        </h2>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
