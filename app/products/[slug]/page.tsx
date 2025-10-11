import ProductClient from './ProductClient';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">❌ Produit introuvable</h2>
          <p className="text-gray-500">Ce produit n’existe plus ou a été retiré de la boutique.</p>
          <a
            href="/products"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Retour à la boutique
          </a>
        </div>
      </div>
    );
  }

  // 🧩 Produits similaires
  const related = await getRelatedProducts(product.category, slug);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Détails du produit */}
      <ProductClient product={product} />

      {/* Produits similaires */}
      {related && related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <a
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition">
                    {p.name}
                  </h3>
                  <p className="text-blue-700 font-bold mt-2">
                    {parseInt(p.price).toLocaleString()} FCFA
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
