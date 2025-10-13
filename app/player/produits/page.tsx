'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

interface Product {
  slug: string;
  name: string;
  price?: number;
  created_at: string;
}

export default function ProductsPage() {
  const supabase = createClientComponentClient();
  // redirect to /login if not authenticated
  useAuthRedirect();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 🔹 Charger les produits
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('Propulser')
        .select('slug, name, price, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Erreur chargement produits :', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Supprimer un produit
  const handleDelete = async (slug: string) => {
    const confirmDelete = confirm('⚠️ Supprimer ce produit ? Cette action est irréversible.');
    if (!confirmDelete) return;

    try {
      setDeleting(slug);
      const { error } = await supabase.from('Propulser').delete().eq('slug', slug);
      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error('Erreur suppression produit :', err);
      alert("❌ Erreur lors de la suppression du produit.");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Loading skeleton
  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-blue-100 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-blue-50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* 🔷 En-tête */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-blue-700">Produits</h1>
        <Link
          href="/player/produits/new"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" /> Nouveau produit
        </Link>
      </div>

      {/* 🔹 Tableau des produits */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          Aucun produit trouvé
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.slug} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.price ? `${product.price.toLocaleString()} FCFA` : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(product.created_at), 'PPP', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-4">
                      {/* ✏️ Modifier */}
                      <Link
                        href={`/player/produits/edit/${product.slug}`}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Modifier"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        onClick={() => handleDelete(product.slug)}
                        className={`text-red-600 hover:text-red-800 transition ${
                          deleting === product.slug ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Supprimer"
                        disabled={deleting === product.slug}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
