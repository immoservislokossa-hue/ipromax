import ProductClient from './ProductClient';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';

export const revalidate = 60; // Revalidation ISR toutes les 60s

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ Attente de la promesse de paramètres
  const { slug } = await params;

  // ⚡ Récupération du produit
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">❌ Produit introuvable</h2>
          <p className="text-gray-500">Ce produit n’existe plus ou a été retiré de la boutique.</p>
          <Link
            href="/produits"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  // 🧩 Produits similaires
  const related = await getRelatedProducts(product.category, slug);

  return (
    <div className="min-h-screen text-gray-900">
      {/* Détails du produit */}
      <ProductClient product={product} />

    </div>
  );
}
