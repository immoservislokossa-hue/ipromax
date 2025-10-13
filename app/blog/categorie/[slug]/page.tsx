"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import BlogBannerHero from "@/app/components/BannerHero/BlogBannerHero";
import VerticalProductList from "@/app/components/Produits/VerticalProductList";
import BlogPreviewCard from "@/app/components/Bloging/BlogPreviewCard";
import {
  Rocket,
  Sparkles,
  Search,
  Cpu,
  Filter,
  FileText,
  Folder,
  User,
  Tag,
  ArrowLeft,
  Home,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  BookOpen
} from "lucide-react";

// Types basés sur votre structure Supabase exacte
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

interface CategoryStats {
  post_count: number;
  total_views: number;
  last_published: string | null;
  avg_reading_time: number;
}

// 🧩 Composant principal OPTIMISÉ SEO
export default function BlogCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const POSTS_PER_PAGE = 9;

  // 🔍 Charger les articles de la catégorie spécifique depuis la vue published_blog_pposts
  const fetchCategoryPosts = async (page: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      }

      let query = supabase
        .from('published_blog_posts')
        .select('*', { count: 'exact' })
        .eq('category_slug', params.slug)
        .order('published_at', { ascending: false });

      // Appliquer la recherche si spécifiée
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
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

  // 📥 Charger les informations de la catégorie depuis blog_categories
  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) throw error;
      setCategory(data);
    } catch (err) {
      console.error('Erreur lors du chargement de la catégorie:', err);
      setError('Catégorie non trouvée');
    }
  };

  // 📊 Charger les statistiques de la catégorie
  const fetchCategoryStats = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('published_blog_posts')
        .select('views, content, published_at')
        .eq('category_slug', params.slug);

      if (postsError) throw postsError;

      const postCount = postsData?.length || 0;
      const totalViews = postsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
      
      const totalReadingTime = postsData?.reduce((sum, post) => {
        const wordCount = post.content?.split(/\s+/).length || 0;
        return sum + Math.max(1, Math.ceil(wordCount / 200));
      }, 0) || 0;

      const avgReadingTime = postCount ? Math.round(totalReadingTime / postCount) : 0;

      const lastPublished = postsData?.length 
        ? postsData.reduce((latest, post) => 
            new Date(post.published_at) > new Date(latest) ? post.published_at : latest, 
            postsData[0].published_at
          )
        : null;

      setCategoryStats({
        post_count: postCount,
        total_views: totalViews,
        last_published: lastPublished,
        avg_reading_time: avgReadingTime
      });
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  // 📋 Charger toutes les catégories pour le sélecteur
  const fetchAllCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setAllCategories(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  // 🔄 Effet principal de chargement
  useEffect(() => {
    if (params.slug) {
      fetchCategoryPosts(1, true);
      fetchCategory();
      fetchCategoryStats();
      fetchAllCategories();
    }
  }, [params.slug, searchTerm]);

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
      const newCategorySlug = e.target.value;
      if (newCategorySlug) {
        router.push(`/blog/categorie/${newCategorySlug}`);
      }
    },
    [router]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchCategoryPosts(currentPage + 1, false);
    }
  }, [isLoading, hasMore, currentPage]);

  const refetch = useCallback(() => {
    fetchCategoryPosts(1, true);
  }, []);

  const resetSearch = useCallback(() => {
    setSearch("");
    setCurrentPage(1);
  }, []);

  const navigateToAllPosts = useCallback(() => {
    router.push('/blog');
  }, [router]);

  const navigateToCategories = useCallback(() => {
    router.push('/blog/categorie');
  }, [router]);

  // 🏷️ Génération des Structured Data pour la catégorie
  const generateCategorySchema = () => {
    if (!category) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": category.name,
      "description": category.description || category.seo_description || `Collection d'articles sur ${category.name} - Epropulse`,
      "url": `https://epropulse.com/blog/categorie/${category.slug}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": categoryStats?.post_count || 0,
        "itemListElement": posts.slice(0, 10).map((post, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "url": `https://epropulse.com/blog/${post.slug}`,
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "author": {
              "@type": "Person",
              "name": post.author_name
            },
            "articleSection": category.name
          }
        }))
      },
      "publisher": {
        "@type": "Organization",
        "name": "Epropulse",
        "url": "https://epropulse.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://epropulse.com/logo.png",
          "width": 180,
          "height": 60
        }
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  };

  // 🏷️ Génération du Breadcrumb Schema
  const generateBreadcrumbSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://epropulse.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://epropulse.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Catégories",
          "item": "https://epropulse.com/blog/categorie"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": category?.name || "Catégorie",
          "item": `https://epropulse.com/blog/categorie/${params.slug}`
        }
      ]
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  };

  // Formatage des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calcul du temps de lecture pour un article
  const calculateReadingTime = (content: string | null) => {
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  // Statistiques pour l'affichage
  const statsCards = [
    {
      label: "Articles publiés",
      value: categoryStats?.post_count.toString() || "0",
      icon: FileText,
      color: "text-blue-600",
      description: "Dans cette catégorie"
    },
    {
      label: "Vues totales",
      value: `${categoryStats?.total_views || 0}+`,
      icon: Eye,
      color: "text-green-600",
      description: "Engagement des lecteurs"
    },
    {
      label: "Temps de lecture moyen",
      value: `${categoryStats?.avg_reading_time || 0} min`,
      icon: Clock,
      color: "text-purple-600",
      description: "Par article"
    }
  ];

  // 🔍 Meta title et description dynamiques pour le head
  useEffect(() => {
    if (category) {
      const metaTitle = category.seo_title || `${category.name} - Articles et Guides | Epropulse`;
      const metaDescription = category.seo_description || 
        `Découvrez tous nos articles sur ${category.name}. ${category.description || `Expertise et conseils en ${category.name} pour votre croissance.`}`;
      
      // Mise à jour du title
      document.title = metaTitle;
      
      // Mise à jour de la meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', metaDescription);
      
      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `https://epropulse.com/blog/categorie/${category.slug}`);
    }
  }, [category]);

  if (error && !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Catégorie non trouvée</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={navigateToAllPosts}
                className="bg-[#0F23E8] text-white px-6 py-3 rounded-xl hover:bg-[#0A1ACF] transition-colors"
              >
                Voir tous les articles
              </button>
              <button
                onClick={navigateToCategories}
                className="border-2 border-[#0F23E8] text-[#0F23E8] px-6 py-3 rounded-xl hover:bg-[#0F23E8] hover:text-white transition-colors"
              >
                Explorer les catégories
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* === STRUCTURED DATA === */}
      {generateBreadcrumbSchema()}
      {generateCategorySchema()}

      {/* === HERO === */}
      <div className="pt-8 pb-12">
        <BlogBannerHero />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* === FIL D'ARIANE === */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 text-sm text-gray-600"
          aria-label="Fil d'Ariane"
        >
          <button
            onClick={navigateToAllPosts}
            className="flex items-center gap-1 hover:text-[#0F23E8] transition-colors"
            aria-label="Retour au blog"
          >
            <Home size={16} aria-hidden="true" />
            Blog
          </button>
          <span aria-hidden="true">›</span>
          <button
            onClick={navigateToCategories}
            className="flex items-center gap-1 hover:text-[#0F23E8] transition-colors"
            aria-label="Voir toutes les catégories"
          >
            Catégories
          </button>
          <span aria-hidden="true">›</span>
          <span className="text-gray-900 font-medium" aria-current="page">
            {category?.name || params.slug}
          </span>
        </motion.nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* === ZONE ARTICLES === */}
          <main className="flex-1">
            {/* 🔍 Barre de recherche et filtres */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col md:flex-row gap-4 md:items-center"
            >
              {/* Champ de recherche */}
              <div className="relative flex-1">
                <label htmlFor="search-articles" className="sr-only">
                  Rechercher dans les articles
                </label>
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                  aria-hidden="true"
                />
                <input
                  id="search-articles"
                  type="text"
                  placeholder={`Rechercher dans ${category?.name}...`}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F23E8]/30 focus:border-[#0F23E8] text-gray-800 placeholder-gray-500 font-medium transition-all duration-300 hover:border-[#0F23E8]/50 shadow-sm"
                  aria-describedby="search-help"
                />
                <div id="search-help" className="sr-only">
                  Recherchez parmi les articles de cette catégorie par titre, extrait ou contenu
                </div>
              </div>

              {/* Sélecteur de catégorie */}
              <div className="relative w-full md:w-60">
                <label htmlFor="category-selector" className="sr-only">
                  Changer de catégorie
                </label>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Filter size={20} aria-hidden="true" />
                </div>
                <select
                  id="category-selector"
                  value={params.slug}
                  onChange={handleCategoryChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F23E8]/30 focus:border-[#0F23E8] text-gray-800 font-medium transition-all duration-300 hover:border-[#0F23E8]/50 cursor-pointer shadow-sm appearance-none"
                  aria-label="Sélectionner une catégorie"
                >
                  <option value={params.slug}>{category?.name}</option>
                  {allCategories
                    .filter(cat => cat.slug !== params.slug)
                    .map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </motion.div>

            {/* --- En-tête de la catégorie --- */}
            <motion.header
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {category?.name}
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl">
                    {category?.description || `Découvrez tous nos articles sur ${category?.name}`}
                  </p>
                </div>
                <button
                  onClick={navigateToCategories}
                  className="flex items-center gap-2 text-[#0F23E8] hover:text-[#0A1ACF] transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                  aria-label="Voir toutes les catégories"
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                  Toutes les catégories
                </button>
              </div>

              {/* Statistiques de la catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {statsCards.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                      <div>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.header>

            {/* --- Informations de filtre --- */}
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex items-center justify-between bg-blue-50/50 rounded-xl p-4 border border-blue-100"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">
                    {total > 0 ? `${total} article(s) trouvé(s)` : 'Aucun article trouvé'}
                    {searchTerm && ` pour "${searchTerm}"`}
                  </span>
                  {searchTerm && (
                    <button
                      onClick={resetSearch}
                      className="text-sm text-[#0F23E8] hover:text-[#0A1ACF] font-medium bg-white px-3 py-1 rounded-lg border border-blue-200"
                      aria-label="Effacer la recherche"
                    >
                      Effacer la recherche
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- États de chargement et erreurs --- */}
            {isLoading && posts.length === 0 ? (
              <div className="text-center py-20" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F23E8] mx-auto mb-4" aria-hidden="true"></div>
                <p className="text-gray-500">Chargement des articles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20" role="alert">
                <p className="text-red-500 font-medium mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="bg-[#0F23E8] text-white px-6 py-3 rounded-xl hover:bg-[#0A1ACF] transition-all duration-300"
                >
                  Réessayer
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500" role="status">
                <div className="text-6xl mb-4" aria-hidden="true">📝</div>
                <p className="text-lg font-medium mb-2">Aucun article dans cette catégorie</p>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? "Aucun article ne correspond à votre recherche"
                    : "Aucun article n'a été publié dans cette catégorie pour le moment"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchTerm && (
                    <button
                      onClick={resetSearch}
                      className="bg-[#0F23E8] text-white px-6 py-3 rounded-xl hover:bg-[#0A1ACF] transition-all duration-300"
                    >
                      Voir tous les articles
                    </button>
                  )}
                  <button
                    onClick={navigateToCategories}
                    className="border-2 border-[#0F23E8] text-[#0F23E8] px-6 py-3 rounded-xl hover:bg-[#0F23E8] hover:text-white transition-all duration-300"
                  >
                    Explorer d'autres catégories
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* === Liste d'articles === */}
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  aria-label={`Liste des articles de la catégorie ${category?.name}`}
                >
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <BlogPreviewCard
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
                        reading_time={calculateReadingTime(post.content)}
                      />
                    </motion.article>
                  ))}
                </motion.section>

                {/* === Bouton "Charger plus" === */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <motion.button
                      onClick={loadMore}
                      disabled={isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#0F23E8] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-[#0A1ACF] hover:shadow-lg flex items-center gap-3 border border-[#0F23E8]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Charger plus d'articles"
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
                            aria-hidden="true"
                          />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <Cpu size={18} aria-hidden="true" />
                          Charger plus d'articles
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </main>

          {/* === SIDEBAR === */}
          <aside className="lg:w-80 flex-shrink-0" aria-label="Informations complémentaires">
            <div className="sticky top-8 space-y-6">
              {/* Navigation des catégories */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
                aria-labelledby="other-categories-heading"
              >
                <h3 id="other-categories-heading" className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Folder className="text-[#0F23E8]" size={20} aria-hidden="true" />
                  Autres catégories
                </h3>
                <nav aria-label="Navigation des catégories">
                  <div className="space-y-2">
                    {allCategories
                      .filter(cat => cat.slug !== params.slug)
                      .slice(0, 5)
                      .map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => router.push(`/blog/categorie/${cat.slug}`)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-[#0F23E8] border border-transparent hover:border-blue-100"
                          aria-label={`Voir les articles de la catégorie ${cat.name}`}
                        >
                          <div className="font-medium">{cat.name}</div>
                          {cat.description && (
                            <div className="text-sm text-gray-500 truncate">{cat.description}</div>
                          )}
                        </button>
                      ))
                    }
                  </div>
                </nav>
                <button
                  onClick={navigateToCategories}
                  className="w-full mt-4 text-center text-[#0F23E8] hover:text-[#0A1ACF] font-medium text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  aria-label="Voir toutes les catégories"
                >
                  Voir toutes les catégories →
                </button>
              </motion.section>

              {/* Bloc Produits récents avec VerticalProductList */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                aria-labelledby="recent-products-heading"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Rocket className="text-[#0F23E8]" size={20} aria-hidden="true" />
                    <h3 id="recent-products-heading" className="font-bold text-gray-900 text-lg">
                      Produits Récents
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Découvrez nos derniers outils et ressources créés avec IA.
                  </p>
                  
                  {/* Intégration de VerticalProductList */}
                  <VerticalProductList 
                    limit={3}
                    compact={true}
                    showViewAll={true}
                  />
                </div>
              </motion.section>

              {/* Derniers articles de la catégorie */}
              {posts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
                  aria-labelledby="popular-articles-heading"
                >
                  <h3 id="popular-articles-heading" className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="text-[#0F23E8]" size={20} aria-hidden="true" />
                    Populaires dans {category?.name}
                  </h3>
                  <nav aria-label="Articles populaires">
                    <div className="space-y-3">
                      {posts
                        .slice(0, 3)
                        .map((post) => (
                          <button
                            key={post.id}
                            onClick={() => router.push(`/blog/${post.slug}`)}
                            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 group"
                            aria-label={`Lire l'article: ${post.title}`}
                          >
                            <div className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-[#0F23E8] transition-colors">
                              {post.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Eye size={12} aria-hidden="true" />
                              <span>{post.views} vues</span>
                              <span aria-hidden="true">•</span>
                              <span>{calculateReadingTime(post.content)} min</span>
                            </div>
                          </button>
                        ))
                      }
                    </div>
                  </nav>
                </motion.section>
              )}

              {/* Informations SEO de la catégorie */}
              {category && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
                  aria-labelledby="category-info-heading"
                >
                  <h3 id="category-info-heading" className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="text-[#0F23E8]" size={20} aria-hidden="true" />
                    À propos
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      {category.description || `Explorez notre collection d'articles sur ${category.name}.`}
                    </p>
                    {category.seo_description && (
                      <p className="text-xs text-gray-500 italic">
                        {category.seo_description}
                      </p>
                    )}
                  </div>
                </motion.section>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}