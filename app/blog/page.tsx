"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/app/utils/supabase/client";
import BlogBannerHero from "@/app/components/BannerHero/BlogBannerHero";
import VerticalProductList from "@/app/components/Produits/VerticalProductList";
import {
  Rocket,
  Sparkles,
  Search,
  Cpu,
  Filter,
  FileText,
  Folder,
  User,
  Tag
} from "lucide-react";
import BlogPreviewCard from "@/app/components/Bloging/BlogPreviewCard";

// Types basés sur votre structure Supabase
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published_at: string;
  updated_at: string;
  author_id: string;
  category_id: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  views: number;
  is_published: boolean;
  author_name: string;
  author_bio: string | null;
  author_avatar: string | null;
  author_social_links: any;
  category_name: string;
  category_slug: string;
  category_description: string | null;
  tags: string[];
  tag_slugs: string[];
}

interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

interface BlogStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_authors: number;
  total_categories: number;
  total_tags: number;
}

// 🧩 Composant principal
export default function BlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState(0);

  const POSTS_PER_PAGE = 9;

  // 🔍 Charger les articles publiés depuis la vue published_blog_posts
  const fetchPosts = async (page: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      }

      let query = supabase
        .from('published_blog_posts')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false });

      // Appliquer les filtres
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (category) {
        query = query.eq('category_slug', category);
      }

      // Pagination
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      if (reset) {
        setPosts(data || []);
      } else {
        setPosts(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore((data?.length || 0) === POSTS_PER_PAGE);
      setTotal(count || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // 📥 Charger les catégories depuis blog_categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  // 📊 Charger les statistiques depuis blog_admin_stats
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_admin_stats')
        .select('*')
        .single();

      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
    fetchCategories();
    fetchStats();
  }, [searchTerm, category]);

  // 🔍 Handlers de filtres et recherche
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategory(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts(currentPage + 1, false);
    }
  }, [isLoading, hasMore, currentPage]);

  const refetch = useCallback(() => {
    fetchPosts(1, true);
  }, []);

  const reset = useCallback(() => {
    setSearch("");
    setCategory("");
    setCurrentPage(1);
  }, []);

  // Statistiques pour l'affichage
  const statsCards = [
    {
      label: "Articles publiés",
      value: `${stats?.published_posts || 0}+`,
      icon: FileText,
      color: "text-blue-600",
      description: `${stats?.total_posts || 0} au total`
    },
    {
      label: "Catégories",
      value: (stats?.total_categories || categories.length).toString(),
      icon: Folder,
      color: "text-green-600",
      description: "Thématiques couvertes"
    },
    {
      label: "Auteurs experts",
      value: (stats?.total_authors || 0).toString(),
      icon: User,
      color: "text-purple-600",
      description: "Contenu de qualité"
    },
    {
      label: "Tags actifs",
      value: (stats?.total_tags || 0).toString(),
      icon: Tag,
      color: "text-orange-600",
      description: "Sujets variés"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* === HERO === */}
      <div className="pt-8 pb-12">
        <BlogBannerHero />
      </div>

      <div className="max-w-7xl mx-auto px-2 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* === ZONE ARTICLES === */}
          <div className="flex-1">
            {/* 🔍 Barre de recherche et filtres */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col md:flex-row gap-4 md:items-center"
            >
              {/* Champ de recherche */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F23E8]/30 focus:border-[#0F23E8] text-gray-800 placeholder-gray-500 font-medium transition-all duration-300 hover:border-[#0F23E8]/50 shadow-sm"
                />
              </div>

              {/* Sélecteur de catégorie */}
              <div className="relative w-full md:w-60">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Filter size={20} />
                </div>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F23E8]/30 focus:border-[#0F23E8] text-gray-800 font-medium transition-all duration-300 hover:border-[#0F23E8]/50 cursor-pointer shadow-sm appearance-none"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* --- Informations de filtre --- */}
            {(searchTerm || category) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    {total > 0 ? `${total} article(s) trouvé(s)` : 'Aucun article trouvé'}
                  </span>
                  {(searchTerm || category) && (
                    <button
                      onClick={reset}
                      className="text-sm text-[#0F23E8] hover:text-[#0A1ACF] font-medium"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- Titre de section --- */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="text-[#0F23E8]" />
                {category ? `Articles - ${categories.find(c => c.slug === category)?.name}` : 'Articles récents'}
              </h2>
              <p className="text-gray-600 mt-1">
                {category 
                  ? `Découvrez nos publications dans la catégorie ${categories.find(c => c.slug === category)?.name}`
                  : 'Explorez nos dernières publications tech, design et marketing'
                }
              </p>
            </motion.div>

            {/* --- États de chargement et erreurs --- */}
            {isLoading && posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F23E8] mx-auto mb-4"></div>
                <p className="text-gray-500">Chargement des articles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 font-medium mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="bg-[#0F23E8] text-white px-6 py-3 rounded-xl hover:bg-[#0A1ACF] transition-all duration-300"
                >
                  Réessayer
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg font-medium mb-2">Aucun article trouvé</p>
                <p className="text-gray-600 mb-6">
                  {searchTerm || category 
                    ? "Essayez de modifier vos critères de recherche"
                    : "Aucun article n'a été publié pour le moment"
                  }
                </p>
                {(searchTerm || category) && (
                  <button
                    onClick={reset}
                    className="bg-[#0F23E8] text-white px-6 py-3 rounded-xl hover:bg-[#0A1ACF] transition-all duration-300"
                  >
                    Voir tous les articles
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* === Liste d'articles === */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {posts.map((post) => (
                    <BlogPreviewCard
                      key={post.id}
                      id={post.id}
                      slug={post.slug}
                      title={post.title}
                      excerpt={post.excerpt || ""}
                      cover_image={post.cover_image || "/default-article-image.jpg"}
                      category_name={post.category_name}
                      published_at={post.published_at}
                      author_name={post.author_name}
                      views={post.views}
                      tags={post.tags}
                    />
                  ))}
                </motion.div>

                {/* === Bouton "Charger plus" === */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <motion.button
                      onClick={loadMore}
                      disabled={isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#0F23E8] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-[#0A1ACF] hover:shadow-lg flex items-center gap-3 border border-[#0F23E8]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <Cpu size={18} />
                          Charger plus d'articles
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* === SIDEBAR === */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-10 space-y-6">
              {/* Statistiques */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="text-[#0F23E8]" size={20} />
                  Statistiques du blog
                </h3>
                <div className="space-y-3">
                  {statsCards.map((stat, index) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <stat.icon size={16} />
                        {stat.label}
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{stat.value}</span>
                        <div className="text-xs text-gray-500">{stat.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Bloc Produits récents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="text-[#0F23E8]" size={20} />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Produits récents
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Découvrez nos derniers outils et ressources créés avec IA.
                </p>
                <VerticalProductList />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}