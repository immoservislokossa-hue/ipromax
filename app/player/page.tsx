'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaPenFancy, FaShoppingBag } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface StatsCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

interface Article {
  id: string;
  title: string;
  created_at: string;
  published: boolean;
}

interface Product {
  id: string;
  name: string;
  created_at: string;
  price?: number;
}

export default function PlayerDashboard() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🔹 Compter les articles
        const { count: articlesCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        // 🔹 Compter les produits
        const { count: productsCount } = await supabase
          .from('Propulser')
          .select('*', { count: 'exact', head: true });

        // 🔹 Charger les 5 derniers articles
        const { data: recentArticles, error: articleError } = await supabase
          .from('blog_posts')
          .select('id, title, created_at, published')
          .order('created_at', { ascending: false })
          .limit(5);

        if (articleError) console.error('Erreur articles:', articleError);

        // 🔹 Charger les 5 derniers produits
        const { data: recentProducts, error: productError } = await supabase
          .from('Propulser')
          .select('id, name, created_at, price')
          .order('created_at', { ascending: false })
          .limit(5);

        if (productError) console.error('Erreur produits:', productError);

        // 🔹 Cartes de stats
        const realStats: StatsCard[] = [
          {
            title: 'Articles publiés',
            value: articlesCount || 0,
            description: 'Total des articles sur le blog',
            icon: <FaPenFancy className="text-3xl text-blue-600" />,
          },
          {
            title: 'Produits actifs',
            value: productsCount || 0,
            description: 'Produits disponibles sur Propulser',
            icon: <FaShoppingBag className="text-3xl text-blue-600" />,
          },
        ];

        setStats(realStats);
        setArticles(recentArticles || []);
        setProducts(recentProducts || []);
      } catch (error) {
        console.error('Erreur chargement dashboard :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-blue-100 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-blue-50 h-32 rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-blue-50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-8">Tableau de bord</h1>

      {/* 📊 Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 border-t-4 border-blue-600 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-3">
              <div>{stat.icon}</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
            <p className="text-3xl font-bold text-blue-700 mt-1">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* 📰 Derniers articles */}
      <section className="bg-white rounded-xl shadow border border-blue-100 mb-10">
        <div className="px-6 py-4 border-b border-blue-100 bg-blue-50 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-700">Derniers articles</h2>
          <Link href="/player/blog" className="text-sm text-blue-600 hover:underline">
            Voir tous
          </Link>
        </div>
        {articles.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {articles.map((article) => (
              <li
                key={article.id}
                className="px-6 py-4 flex justify-between items-center hover:bg-blue-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{article.title}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(article.created_at), 'PPp', { locale: fr })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {article.published ? 'Publié' : 'Brouillon'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-gray-500 text-center">Aucun article trouvé</p>
        )}
      </section>

      {/* 🛍️ Derniers produits */}
      <section className="bg-white rounded-xl shadow border border-blue-100 mb-12">
        <div className="px-6 py-4 border-b border-blue-100 bg-blue-50 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-700">Derniers produits</h2>
          <Link href="/player/products" className="text-sm text-blue-600 hover:underline">
            Voir tous
          </Link>
        </div>
        {products.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {products.map((product) => (
              <li
                key={product.id}
                className="px-6 py-4 flex justify-between items-center hover:bg-blue-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(product.created_at), 'PPp', { locale: fr })}
                  </p>
                </div>
                {product.price && (
                  <span className="text-sm font-semibold text-blue-700">
                    {product.price.toLocaleString()} FCFA
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-gray-500 text-center">Aucun produit trouvé</p>
        )}
      </section>

      {/* ⚡ Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link
          href="/player/new-blog"
          className="flex items-center justify-center p-6 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition transform"
        >
          <FaPenFancy className="text-3xl mr-3" />
          Nouvel article
        </Link>

        <Link
          href="/player/new-product"
          className="flex items-center justify-center p-6 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition transform"
        >
          <FaShoppingBag className="text-3xl mr-3" />
          Nouveau produit
        </Link>
      </div>
    </div>
  );
}
