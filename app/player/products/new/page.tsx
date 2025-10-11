'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function NewProductPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [product, setProduct] = useState({
    name: 'Formation Next.js Ultime — Crée ton site pro ultra-rapide',
    category: 'Développement Web',
    description:
      'La formation complète pour maîtriser Next.js, Tailwind et Supabase, et construire des sites modernes ultra-rapides.',
    detailed_description: `Cette formation t’apprend à créer des applications web modernes avec Next.js 14, Tailwind CSS et Supabase.
Tu apprendras à :

- Construire des interfaces réactives avec Next.js
- Gérer l’authentification et les données avec Supabase
- Déployer ton projet sur Vercel
- Optimiser ton SEO et la performance.

Le programme inclut +10h de vidéos, des ressources téléchargeables et un support communautaire.`,
    price: '49000',
    original_price: '69000',
    image:
      'https://images.unsplash.com/photo-1605902711622-cfb43c4437f9?w=1200&q=80',
    gallery:
      'https://images.unsplash.com/photo-1633113093920-3ff6c9c6e2f2?w=800,q=80, https://images.unsplash.com/photo-1610465299994-4f38d8b5e29b?w=800,q=80',
    brand: 'Propulser Academy',
    features:
      'Framework Next.js 14, intégration Tailwind CSS, base de données Supabase, SEO optimisé',
    benefits:
      'Développe ton propre SaaS, crée des sites rapides, gagne du temps grâce à une architecture moderne',
    delivery_info: 'Accès instantané après achat via ton espace membre.',
    file_format: 'Vidéos HD + fichiers ZIP téléchargeables',
    access_type: 'Accès illimité',
    order_link: 'https://propulser.store/checkout/nextjs-ultime',
    seo_title:
      'Formation Next.js Ultime — Crée ton site web moderne avec Tailwind & Supabase',
    seo_description:
      'Maîtrise Next.js, Tailwind et Supabase pour créer des applications web rapides, scalables et SEO-friendly.',
    seo_keywords:
      'nextjs, tailwind, supabase, formation web, react, javascript',
    is_new: true,
    promo: true,
    is_luxury: false,
    instock: true,
  });

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.floor(Date.now() / 1000).toString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('🔒 Vous devez être connecté.');

      if (!product.name || !product.category)
        throw new Error('⚠️ Le nom et la catégorie sont obligatoires.');

      const slug = generateSlug(product.name);
      const galleryArray =
        product.gallery.trim() !== ''
          ? product.gallery.split(',').map((url) => url.trim())
          : null;

      const { error } = await supabase.from('Propulser').insert([
        {
          slug,
          name: product.name,
          category: product.category,
          description: product.description || null,
          detailed_description: product.detailed_description || null,
          price: product.price ? parseFloat(product.price) : null,
          original_price: product.original_price
            ? parseFloat(product.original_price)
            : null,
          image: product.image || null,
          gallery: galleryArray,
          brand: product.brand || null,
          features: product.features || null,
          benefits: product.benefits || null,
          delivery_info: product.delivery_info || null,
          file_format: product.file_format || null,
          access_type: product.access_type || null,
          order_link: product.order_link || null,
          seo_title: product.seo_title || null,
          seo_description: product.seo_description || null,
          seo_keywords: product.seo_keywords || null,
          is_new: product.is_new,
          promo: product.promo,
          is_luxury: product.is_luxury,
          instock: product.instock,
        },
      ]);

      if (error) throw error;

      setMessage('✅ Produit ajouté avec succès ! Redirection...');
      setTimeout(() => router.push('/player/products'), 1500);
    } catch (err: any) {
      console.error('Erreur Supabase :', err);
      setMessage(`❌ ${err.message || 'Erreur inconnue lors de l’ajout.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-8">
        Ajouter un nouveau produit
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 border-t-4 border-blue-600 space-y-6"
      >
        {/* Nom & Catégorie */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Nom du produit *" name="name" value={product.name} setProduct={setProduct} />
          <Input label="Catégorie *" name="category" value={product.category} setProduct={setProduct} />
        </div>

        {/* Description */}
        <Input label="Description courte" name="description" value={product.description} setProduct={setProduct} />
        <Textarea label="Description détaillée" name="detailed_description" value={product.detailed_description} setProduct={setProduct} />

        {/* Prix */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Prix" name="price" value={product.price} setProduct={setProduct} type="number" />
          <Input label="Ancien prix (si promo)" name="original_price" value={product.original_price} setProduct={setProduct} type="number" />
        </div>

        {/* Images */}
        <Input label="Image principale (URL)" name="image" value={product.image} setProduct={setProduct} />
        <Input label="Galerie (séparée par des virgules)" name="gallery" value={product.gallery} setProduct={setProduct} />

        {/* Infos supplémentaires */}
        <Input label="Marque" name="brand" value={product.brand} setProduct={setProduct} />
        <Input label="Caractéristiques" name="features" value={product.features} setProduct={setProduct} />
        <Input label="Bénéfices" name="benefits" value={product.benefits} setProduct={setProduct} />
        <Input label="Infos livraison" name="delivery_info" value={product.delivery_info} setProduct={setProduct} />
        <Input label="Format du fichier" name="file_format" value={product.file_format} setProduct={setProduct} />
        <Input label="Type d'accès" name="access_type" value={product.access_type} setProduct={setProduct} />
        <Input label="Lien de commande" name="order_link" value={product.order_link} setProduct={setProduct} />

        {/* SEO */}
        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Titre SEO" name="seo_title" value={product.seo_title} setProduct={setProduct} />
          <Input label="Description SEO" name="seo_description" value={product.seo_description} setProduct={setProduct} />
          <Input label="Mots-clés SEO" name="seo_keywords" value={product.seo_keywords} setProduct={setProduct} />
        </div>

        {/* Booléens */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            ['is_new', 'Nouveau'],
            ['promo', 'En promotion'],
            ['is_luxury', 'Produit de luxe'],
            ['instock', 'En stock'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={product[key as keyof typeof product] as boolean}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    [key]: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600"
              />
              {label}
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push('/player/products')}
            className="px-5 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded font-semibold text-white transition ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Ajout...' : 'Ajouter le produit'}
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

// --- Composants utilitaires (pour alléger le code principal) ---
const Input = ({
  label,
  name,
  value,
  setProduct,
  type = 'text',
}: {
  label: string;
  name: string;
  value: any;
  setProduct: any;
  type?: string;
}) => (
  <div>
    <label className="block text-blue-700 font-semibold mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setProduct((p: any) => ({ ...p, [name]: e.target.value }))}
      className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const Textarea = ({
  label,
  name,
  value,
  setProduct,
}: {
  label: string;
  name: string;
  value: any;
  setProduct: any;
}) => (
  <div>
    <label className="block text-blue-700 font-semibold mb-1">{label}</label>
    <textarea
      rows={5}
      value={value}
      onChange={(e) => setProduct((p: any) => ({ ...p, [name]: e.target.value }))}
      className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
    />
  </div>
);
