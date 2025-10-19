// app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { transformMarkdownToHtml } from "@/app/utils/markdown";
import { notFound } from "next/navigation";
import Image from "next/image";
import VerticalProductList from "@/app/components/Produits/VerticalProductList";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Eye, 
  ArrowLeft, 
  User, 
  Tag, 
  Rocket,
  Share2,
  BookOpen,
  ChevronRight
} from "lucide-react";
import ArticleActions from '@/app/components/Bloging/ArticleActions';
import SocialShareButtons from '@/app/components/Bloging/SocialShareButtons';
import { createClient } from "@/app/utils/supabase/client";

// Types
interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  role: string;
  social_links: any;
}

interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
}

interface BlogTag {
  id: number;
  slug: string;
  name: string;
}

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
  author?: Author;
  category?: Category;
  tags?: BlogTag[];
}

// --- Composant principal
export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      try {
        const supabase = createClient();
        
        const { data: post, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            author:authors(*),
            category:blog_categories(*),
            blog_post_tags(
              tag:blog_tags(*)
            )
          `)
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error || !post) {
          console.error('Erreur récupération article:', error);
          return;
        }

        const transformedPost: BlogPost = {
          ...post,
          tags: post.blog_post_tags?.map((pt: any) => pt.tag) || []
        };

        setPost(transformedPost);

        // Convertir le markdown en HTML
        if (post.content) {
          const contentHtml = await transformMarkdownToHtml(post.content);
          setHtmlContent(contentHtml);
        }

        // Incrémenter les vues
        setTimeout(async () => {
          try {
            await supabase
              .from('blog_posts')
              .update({ views: (post.views || 0) + 1 })
              .eq('id', post.id);
          } catch (error) {
            console.error('Erreur incrémentation vues:', error);
          }
        }, 0);

      } catch (error) {
        console.error('Erreur fetchPost:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="mb-8">
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
            {/* Content skeleton */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Cover image skeleton */}
                <div className="h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse"></div>
                
                {/* Header skeleton */}
                <div className="p-6 sm:p-8">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  
                  {/* Author skeleton */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mt-6">
                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="px-6 sm:px-8 pb-8">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="xl:w-80 flex-shrink-0">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  const readingTime = Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 0) / 200));
  const publishedAt = post.published_at || post.updated_at;
  const canonicalUrl = `https://epropulse.com/blog/${post.slug}`;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Accueil
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight size={14} />
              <Link href="/blog" className="hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </li>
            {post.category && (
              <li className="flex items-center gap-2">
                <ChevronRight size={14} />
                <Link 
                  href={`/blog/categorie/${post.category.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.category.name}
                </Link>
              </li>
            )}
            <li className="flex items-center gap-2">
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
                {post.title}
              </span>
            </li>
          </ol>
        </nav>
        
        {/* Layout principal */}
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
          {/* Contenu principal */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Image de couverture */}
              {post.cover_image && (
                <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />
                </div>
              )}

              {/* En-tête */}
              <header className="p-6 sm:p-8">
                {/* Métadonnées */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                    {post.category && (
                      <Link
                        href={`/blog/categorie/${post.category.slug}`}
                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors border border-blue-200 w-fit"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        <time dateTime={publishedAt}>
                          {new Date(publishedAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{readingTime} min de lecture</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye size={16} />
                        <span>{(post.views || 0).toLocaleString()} vues</span>
                      </div>
                    </div>
                  </div>
                  <ArticleActions 
                    title={post.title} 
                    excerpt={post.excerpt || ''} 
                  />
                </div>

                {/* Titre */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Extrait */}
                {post.excerpt && (
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Auteur */}
                {post.author && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {post.author.avatar ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white">
                        <User size={20} className="text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{post.author.name}</p>
                      {post.author.role && (
                        <p className="text-sm text-gray-500 capitalize">{post.author.role}</p>
                      )}
                      {post.author.bio && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                )}
              </header>

              {/* Contenu */}
              <section className="px-6 sm:px-8 pb-8">
                <div
                  className="prose prose-lg max-w-none 
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900
                            prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:rounded-lg prose-blockquote:px-6 prose-blockquote:py-4
                            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
                            prose-img:rounded-lg prose-img:shadow-sm
                            prose-ul:text-gray-700 prose-ol:text-gray-700
                            prose-li:marker:text-blue-500
                            prose-table:border-collapse prose-table:border prose-table:border-gray-300
                            prose-th:bg-gray-100 prose-th:text-gray-900 prose-th:font-semibold
                            prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </section>

              {/* Partage */}
              <footer className="px-6 sm:px-8 pb-8 border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Share2 className="text-blue-600" size={20} />
                    <div>
                      <p className="font-semibold text-blue-900">Partager cet article</p>
                      <p className="text-blue-700 text-sm">Aidez à diffuser ce contenu</p>
                    </div>
                  </div>
                  <SocialShareButtons 
                    title={post.title}
                    url={canonicalUrl}
                  />
                </div>
              </footer>

              {/* Mots-clés SEO */}
              {post.seo_keywords && (
                <div className="px-6 sm:px-8 pb-8 border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                      <Tag size={14} />
                      Mots-clés :
                    </span>
                    {post.seo_keywords.split(',').map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200"
                      >
                        #{keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
              <Link 
                href="/blog"
                className="bg-white rounded-xl px-6 py-3 border border-gray-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900 flex items-center gap-2 group text-center justify-center"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Retour au blog
              </Link>
              
              {post.category && (
                <Link
                  href={`/blog/categorie/${post.category.slug}`}
                  className="bg-white rounded-xl px-6 py-3 border border-gray-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900 flex items-center gap-2 group text-center justify-center"
                >
                  Plus d'articles dans {post.category.name}
                  <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              )}
            </nav>
          </article>

          {/* Sidebar */}
          <aside className="xl:w-80 flex-shrink-0">
            <div className="xl:sticky xl:top-8 space-y-6">
              {/* Produits */}
              <section className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Rocket className="text-blue-600" size={20} />
                  Produits Récents
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Découvrez nos derniers outils et ressources.
                </p>
                <VerticalProductList 
                  limit={3}
                  compact={true}
                />
              </section>

              {/* Statistiques */}
              <section className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Clock size={14} />
                      Temps de lecture
                    </span>
                    <span className="font-semibold text-gray-900">{readingTime} min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Eye size={14} />
                      Vues
                    </span>
                    <span className="font-semibold text-gray-900">{(post.views || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar size={14} />
                      Publié le
                    </span>
                    <span className="font-semibold text-gray-900 text-right">
                      {new Date(publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </section>

              {/* Catégorie */}
              {post.category && (
                <section className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Catégorie</h3>
                  <Link
                    href={`/blog/categorie/${post.category.slug}`}
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="font-medium text-gray-900">{post.category.name}</div>
                    {post.category.description && (
                      <div className="text-sm text-gray-600 mt-1">{post.category.description}</div>
                    )}
                  </Link>
                </section>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <section className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Mots-clés</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 8).map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors border border-gray-200"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Auteur */}
              {post.author && (
                <section className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Auteur</h3>
                  <div className="flex items-center gap-3 mb-3">
                    {post.author.avatar ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white">
                        <User size={20} className="text-blue-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{post.author.name}</p>
                      {post.author.role && (
                        <p className="text-xs text-gray-500 capitalize">{post.author.role}</p>
                      )}
                    </div>
                  </div>
                  {post.author.bio && (
                    <p className="text-sm text-gray-600 line-clamp-3">{post.author.bio}</p>
                  )}
                </section>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}