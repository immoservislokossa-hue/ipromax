'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaSave } from 'react-icons/fa';
import { useAuthRedirect } from '../../../hooks/useAuthRedirect';

interface Product {
  slug: string;
  name: string;
  price?: number;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export default function ProductEditPage() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });

  // Redirection si non authentifié
  useAuthRedirect();

  // 🔹 Charger le produit spécifique pour l'édition
  const fetchProduct = async () => {
    if (!slug) return;
    
    try {
      const { data, error } = await supabase
        .from('Propulser')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      
      setProduct(data);
      setFormData({
        name: data.name || '',
        price: data.price ? data.price.toString() : '',
        description: data.description || ''
      });
    } catch (err) {
      console.error('Erreur chargement produit :', err);
      alert('Produit non trouvé');
      router.push('/player/products');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Charger tous les produits (pour la liste)
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
    }
  };

  // 🔹 Sauvegarder les modifications
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Le nom du produit est requis');
      return;
    }

    try {
      setSaving(true);
      const updates = {
        name: formData.name.trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description.trim(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('Propulser')
        .update(updates)
        .eq('slug', slug);

      if (error) throw error;

      alert('✅ Produit modifié avec succès');
      router.push('/player/products');
    } catch (err) {
      console.error('Erreur modification produit :', err);
      alert('❌ Erreur lors de la modification du produit');
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Supprimer un produit
  const handleDelete = async (productSlug: string) => {
    const confirmDelete = confirm('⚠️ Supprimer ce produit ? Cette action est irréversible.');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('Propulser').delete().eq('slug', productSlug);
      if (error) throw error;

      if (productSlug === slug) {
        // Si on supprime le produit actuellement édité
        router.push('/player/products');
      } else {
        // Sinon, mettre à jour la liste
        setProducts((prev) => prev.filter((p) => p.slug !== productSlug));
      }
    } catch (err) {
      console.error('Erreur suppression produit :', err);
      alert("❌ Erreur lors de la suppression du produit.");
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
    fetchProducts();
  }, [slug]);

  // 🔹 Loading skeleton pour l'édition
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-blue-100 rounded w-1/3 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-blue-50 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-blue-50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* 🔷 En-tête avec navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/player/products"
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              <FaArrowLeft className="mr-2" /> Retour
            </Link>
            <h1 className="text-3xl font-extrabold text-blue-700">
              {product ? `Modifier : ${product.name}` : 'Édition Produit'}
            </h1>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              <FaSave className="mr-2" /> 
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            
            <Link
              href="/player/products/new"
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <FaPlus className="mr-2" /> Nouveau
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 🔹 Formulaire d'édition (2/3 de largeur) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Informations du produit</h2>
              
              <div className="space-y-6">
                {/* Nom du produit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Nom du produit"
                  />
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (FCFA)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Prix en FCFA"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    placeholder="Description du produit..."
                  />
                </div>

                {/* Informations techniques */}
                {product && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informations techniques</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Slug :</span>
                        <p className="font-mono text-gray-800">{product.slug}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Créé le :</span>
                        <p className="text-gray-800">
                          {format(new Date(product.created_at), 'PPP à HH:mm', { locale: fr })}
                        </p>
                      </div>
                      {product.updated_at && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Modifié le :</span>
                          <p className="text-gray-800">
                            {format(new Date(product.updated_at), 'PPP à HH:mm', { locale: fr })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🔹 Liste des produits (1/3 de largeur) */}
          <div className="space-y-6">
            {/* Statistiques rapides */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Statistiques</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total produits :</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                {product && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Produit actuel :</span>
                    <span className="font-semibold text-blue-600">{product.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Liste des produits */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h3 className="font-semibold text-blue-700">Tous les produits</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Aucun produit
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <div 
                        key={p.slug} 
                        className={`p-4 hover:bg-blue-50 transition ${
                          p.slug === slug ? 'bg-blue-100 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${
                              p.slug === slug ? 'text-blue-700' : 'text-gray-900'
                            }`}>
                              {p.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {p.price ? `${p.price.toLocaleString()} FCFA` : '—'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {format(new Date(p.created_at), 'dd/MM/yy', { locale: fr })}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 ml-3">
                            <Link
                              href={`/player/products/edit/${p.slug}`}
                              className="text-blue-600 hover:text-blue-800 transition p-1"
                              title="Modifier"
                            >
                              <FaEdit size={14} />
                            </Link>

                            <button
                              onClick={() => handleDelete(p.slug)}
                              className="text-red-600 hover:text-red-800 transition p-1"
                              title="Supprimer"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Actions rapides</h3>
              <div className="space-y-2">
                <Link
                  href="/player/products/new"
                  className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                >
                  <FaPlus className="mr-2" /> Nouveau produit
                </Link>
                <Link
                  href="/player/products"
                  className="flex items-center justify-center w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition text-sm"
                >
                  Voir tous les produits
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}