'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, Calendar, Eye, ArrowRight, BookOpen, Sparkles, Zap, Cpu, TrendingUp, Rocket } from 'lucide-react';
import BlogBannerHero from '@/app/components/BannerHero/BlogBannerHero';
import { useBlogPosts, BlogPost } from '@/app/hooks/useBlogPosts';
import RecentProducts from '@/app/components/Products/RecentProducts';

// --- Composant de filtre style tech
function BlogFilters({ 
  onSearchChange, 
  onCategoryChange, 
  onReset 
}: { 
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [localCategory, setLocalCategory] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setLocalCategory(newCategory);
    onCategoryChange(newCategory);
  };

  const handleReset = () => {
    setLocalSearch('');
    setLocalCategory('');
    onReset();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 p-6 mb-8 relative overflow-hidden"
    >
      {/* Effet de bordure tech */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#0F23E8] to-transparent" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Barre de recherche style tech */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSearchSubmit} className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F23E8]/10 to-[#0F23E8]/5 rounded-xl blur-sm" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un article tech..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-300/50 rounded-xl focus:ring-2 focus:ring-[#0F23E8]/30 focus:border-[#0F23E8] text-gray-800 placeholder-gray-500 font-medium transition-all duration-300 hover:border-[#0F23E8]/50"
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0F23E8] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-[#0A1ACF] hover:shadow-lg whitespace-nowrap flex items-center gap-3 shadow-md border border-[#0F23E8]/20"
              >
                <Cpu size={18} />
                Rechercher
              </motion.button>
            </form>
          </div>
          
          {/* Filtres style tech */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F23E8]/5 to-[#0F23E8]/10 rounded-xl blur-sm" />
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={18} />
         <select
  value={localCategory}
  onChange={handleCategoryChange}
  aria-label="Filtrer par catégorie"
  className="relative pl-10 pr-8 py-4 bg-white/90 border-2 border-gray-300/50 rounded-xl focus:ring-2 focus:ring-[#0F23E8]/30 focus:border-[#0F23E8] text-gray-800 font-medium appearance-none cursor-pointer transition-all duration-300 hover:border-[#0F23E8]/50 min-w-[180px]"
>
  <option value="">🧠 Toutes les catégories</option>
  <option value="Technologie">🚀 Technologie</option>
  <option value="Design">🎨 Design</option>
  <option value="Marketing">📈 Marketing</option>
  <option value="Développement">💻 Développement</option>
  <option value="SEO">🔍 SEO</option>
  <option value="Mobile">📱 Mobile</option>
</select>
              </div>
            </div>
            
            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 text-gray-600 hover:text-gray-800 border-2 border-gray-300/50 hover:border-gray-400 rounded-xl bg-white/90 hover:bg-white font-medium transition-all duration-300 hover:shadow-lg flex items-center gap-2"
            >
              <Zap size={16} />
              Réinitialiser
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Composant Article Card style tech
function ArticleCard({ article, index }: { article: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="group relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/80 overflow-hidden transition-all duration-300 cursor-pointer"
    >
      {/* Effet de surbrillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F23E8]/5 via-transparent to-[#0F23E8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link href={`/blog/${article.slug}`} className="block h-full relative z-10">
        {/* Image de couverture */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Badge catégorie */}
          {article.category && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="absolute top-4 left-4"
            >
              <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-300/50">
                {article.category}
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Contenu de la carte */}
        <div className="p-6 flex flex-col flex-1 relative">
          {/* Métadonnées */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0F23E8]" />
              <time dateTime={article.publishedAt} className="font-medium">
                {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short'
                })}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#0F23E8]" />
              <span className="font-medium">{article.readingTime} min</span>
            </div>
            {article.views && (
              <div className="flex items-center gap-1.5">
                <Eye size={14} className="text-[#0F23E8]" />
                <span className="font-medium">{article.views}</span>
              </div>
            )}
          </div>

          {/* Titre */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0F23E8] transition-colors duration-300 leading-tight">
            {article.title}
          </h2>
          
          {/* Extrait */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>
          
          {/* Bouton Lire */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/60">
            <span className="text-[#0F23E8] font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
              Lire l'article 
              <ArrowRight size={16} className="group-hover:scale-110 transition-transform duration-300" />
            </span>
            <div className="w-8 h-8 bg-[#0F23E8] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen size={16} className="text-white" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// --- Composant de chargement
function LoadingSpinner() {
  return (
    <div className="text-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-3 border-gray-300 border-t-[#0F23E8] rounded-full mx-auto mb-4"
      />
      <p className="text-gray-600 font-medium">Chargement des articles...</p>
    </div>
  );
}

// --- Composant d'erreur
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="bg-white/95 rounded-2xl p-8 max-w-md mx-auto border border-gray-200 shadow-lg">
        <div className="text-4xl mb-4">😔</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Oups !</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#0F23E8] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-[#0A1ACF]"
        >
          Réessayer
        </motion.button>
      </div>
    </motion.div>
  );
}

// --- Composant état vide
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="bg-white/95 rounded-2xl p-8 max-w-md mx-auto border border-gray-200 shadow-lg">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun article trouvé</h3>
        <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#0F23E8] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-[#0A1ACF]"
        >
          Voir tous les articles
        </motion.button>
      </div>
    </motion.div>
  );
}

// --- Composant principal de la page Blog
export default function BlogPage() {
  const { 
    posts, 
    isLoading, 
    error, 
    hasMore, 
    loadMore, 
    setSearch, 
    setCategory, 
    reset 
  } = useBlogPosts();

  const handleSearchChange = useCallback((search: string) => {
    setSearch(search);
  }, [setSearch]);

  const handleCategoryChange = useCallback((category: string) => {
    setCategory(category);
  }, [setCategory]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Bannière Hero */}
      <div className="pt-8 pb-12">
        <BlogBannerHero />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne principale - Articles */}
          <div className="flex-1">
            {/* Filtres */}
            <BlogFilters 
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onReset={handleReset}
            />

            {/* Contenu principal */}
            <div id="articles">
              {isLoading && posts.length === 0 ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorState error={error} onRetry={handleReset} />
              ) : posts.length === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <>
                  {/* En-tête des articles */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-[#0F23E8]" size={24} />
                      <h2 className="text-2xl font-bold text-gray-900">Articles Récents</h2>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {posts.length} article{posts.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Grille d'articles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
                    <AnimatePresence>
                      {posts.map((article, index) => (
                        <ArticleCard 
                          key={article.id} 
                          article={article} 
                          index={index} 
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Bouton Charger plus */}
                  {hasMore && (
                    <div className="text-center">
                      <motion.button
                        onClick={loadMore}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#0F23E8] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-[#0A1ACF] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto border border-[#0F23E8]/20"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Chargement...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            Charger plus d'articles
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Produits Récents */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              {/* En-tête Produits Récents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="text-[#0F23E8]" size={20} />
                  <h3 className="font-bold text-gray-900 text-lg">Produits Récents</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Découvrez nos derniers outils et ressources tech
                </p>
              </motion.div>

              {/* Composant RecentProducts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden"
              >
                <RecentProducts />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}