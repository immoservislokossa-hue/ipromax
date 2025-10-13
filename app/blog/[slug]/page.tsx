import { transformMarkdownToHtml } from "@/app/utils/markdown";
import { notFound } from "next/navigation";
import Image from "next/image";
import VerticalProductList from "@/app/components/Produits/VerticalProductList";
import { Metadata } from "next";
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
  TrendingUp
} from "lucide-react";
import ArticleActions from '@/app/components/Bloging/ArticleActions';
import SocialShareButtons from '@/app/components/Bloging/SocialShareButtons';

// --- Configuration
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Types basés sur votre structure Supabase exacte
interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  role: string;
  social_links: any;
  created_at: string;
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

// --- Fonction pour récupérer l'article avec toutes les relations
async function getBlogPostWithRelations(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Récupérer l'article avec toutes les relations via des jointures
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
      return null;
    }

    // Transformer la structure des tags
    const transformedPost: BlogPost = {
      ...post,
      tags: post.blog_post_tags?.map((pt: any) => pt.tag) || []
    };

    // ⚡ OPTIMISATION: Incrémentation non-bloquante des vues
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

    return transformedPost;
  } catch (error) {
    console.error('Erreur getBlogPostWithRelations:', error);
    return null;
  }
}

// --- Metadata PERFECTIONNÉE
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const data = await getBlogPostWithRelations(slug);
    
    if (!data) {
      return {
        title: "Article non trouvé - Epropulse",
        description: "Cet article n'existe pas ou a été supprimé.",
        robots: "noindex, nofollow"
      };
    }
    
    const title = data.seo_title || data.title;
    const description = (data.seo_description || data.excerpt || `Découvrez "${data.title}" - un article complet sur Epropulse.`).substring(0, 160);
    const keywords = data.seo_keywords || undefined;
    const authors = data.author ? [data.author.name] : undefined;
    const tags = data.tags?.map(tag => tag.name) || undefined;
    const url = `https://epropulse.com/blog/${data.slug}`;
    
    return {
      title,
      description,
      keywords,
      authors,
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: data.published_at,
        modifiedTime: data.updated_at,
        authors,
        tags,
        url,
        siteName: "Epropulse",
        locale: "fr_FR",
        images: data.cover_image ? [{ 
          url: data.cover_image,
          width: 1200,
          height: 630,
          alt: data.title
        }] : [{
          url: 'https://epropulse.com/og-image-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Epropulse - Marketing et Growth'
        }],
      },
      twitter: {
        card: data.cover_image ? 'summary_large_image' : 'summary',
        title,
        description,
        images: data.cover_image ? [data.cover_image] : ['https://epropulse.com/twitter-image-default.jpg'],
        creator: data.author ? `@${data.author.name.replace(/\s+/g, '')}` : '@epropulse',
        site: '@epropulse',
      },
    };
  } catch (error) {
    console.error('Erreur generateMetadata:', error);
    return {
      title: "Article - Epropulse",
      description: "Découvrez cet article intéressant sur Epropulse.",
      robots: "noindex, nofollow"
    };
  }
}

// --- Génération des slugs statiques
import { createServerSupabaseClient } from '@/app/utils/supabase/server';
export async function generateStaticParams() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error('Erreur generateStaticParams:', error);
      return [];
    }
    
    const params = posts?.map((post) => ({ slug: post.slug })) || [];
    return params;
  } catch (error) {
    console.error('Erreur generateStaticParams:', error);
    return [];
  }
}

// --- Composant pour les métadonnées de l'auteur
function AuthorSchema({ author }: { author: Author }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://epropulse.com/auteur/${author.id}`,
    name: author.name,
    description: author.bio || `Auteur expert chez Epropulse spécialisé en ${author.role}`,
    image: author.avatar,
    jobTitle: author.role,
    url: `https://epropulse.com/auteur/${author.id}`,
    worksFor: {
      '@type': 'Organization',
      name: 'Epropulse'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- Composant pour le schéma Article PERFECTIONNÉ
function ArticleSchema({ post, htmlContent }: { post: BlogPost, htmlContent: string }) {
  const cleanContent = htmlContent.replace(/<[^>]*>/g, '').substring(0, 5000);
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image ? [post.cover_image] : ['https://epropulse.com/og-image-default.jpg'],
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      '@id': `https://epropulse.com/auteur/${post.author?.id}`,
      name: post.author?.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Epropulse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://epropulse.com/logo.png',
        width: 180,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://epropulse.com/blog/${post.slug}`,
    },
    articleSection: post.category?.name,
    articleBody: cleanContent,
    keywords: post.seo_keywords || post.tags?.map(tag => tag.name).join(', '),
    wordCount: post.content?.split(/\s+/).length || 0,
    inLanguage: 'fr-FR',
    timeRequired: `PT${Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 0) / 200))}M`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- Composant Breadcrumb Schema (NOUVEAU)
function BreadcrumbSchema({ post, category }: { post: BlogPost; category?: Category }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://epropulse.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://epropulse.com/blog',
      },
      ...(category ? [{
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://epropulse.com/blog/categorie/${category.slug}`,
      }] : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name: post.title,
        item: `https://epropulse.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- Composant pour la section Partage améliorée
function EnhancedShareSection({ title }: { title: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Share2 className="text-blue-600 animate-pulse" size={24} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        </div>
        <div>
          <p className="font-semibold text-blue-900 text-lg">Partager cet article</p>
          <p className="text-blue-700 text-sm">Aidez à diffuser ce contenu</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-blue-800 font-medium hidden sm:block">Partager :</span>
        <SocialShareButtons 
          title={title}
          url={typeof window !== 'undefined' ? window.location.href : ''}
          variant="colored"
        />
      </div>
    </div>
  );
}

// --- Fonction d'optimisation Cloudinary (NOUVELLE)
function getOptimizedImageUrl(imageUrl: string | null, options: { width?: number; height?: number; quality?: number } = {}) {
  if (!imageUrl) return null;
  
  // Si c'est déjà une URL Cloudinary optimisée
  if (imageUrl.includes('cloudinary.com') && !imageUrl.includes('/upload/')) {
    return imageUrl;
  }
  
  // Si c'est une URL Cloudinaire mais pas optimisée
  if (imageUrl.includes('res.cloudinary.com')) {
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const baseUrl = imageUrl.substring(0, uploadIndex + 8); // /upload/ = 8 caractères
      const restOfUrl = imageUrl.substring(uploadIndex + 8);
      
      const transformations = [];
      if (options.width) transformations.push(`w_${options.width}`);
      if (options.height) transformations.push(`h_${options.height}`);
      transformations.push('c_fill');
      transformations.push('q_auto:good');
      transformations.push('f_auto');
      
      return `${baseUrl}/${transformations.join(',')}/${restOfUrl}`;
    }
  }
  
  return imageUrl;
}

// --- Composant principal PERFECTIONNÉ
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBlogPostWithRelations(slug);
  
  if (!data) {
    notFound();
  }

  try {
    const htmlContent = await transformMarkdownToHtml(data.content || "");
    const readingTime = Math.max(1, Math.ceil((data.content?.split(/\s+/).length || 0) / 200));
    const publishedAt = data.published_at || data.updated_at;
    
    // Optimisation des images Cloudinary
    const optimizedCoverImage = getOptimizedImageUrl(data.cover_image, { width: 1200, height: 630 });
    const optimizedAuthorAvatar = getOptimizedImageUrl(data.author?.avatar || null, { width: 100, height: 100 });
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Structured Data PERFECTIONNÉ */}
        <BreadcrumbSchema post={data} category={data.category} />
        <ArticleSchema post={data} htmlContent={htmlContent} />
        {data.author && <AuthorSchema author={data.author} />}
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb Navigation (NOUVEAU) */}
          <nav className="mb-8" aria-label="Fil d'Ariane">
            <ol className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-400">/</span>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              {data.category && (
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">/</span>
                  <Link 
                    href={`/blog/categorie/${data.category.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {data.category.name}
                  </Link>
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 font-medium truncate max-w-48 md:max-w-96">
                  {data.title}
                </span>
              </li>
            </ol>
          </nav>
          
          {/* Layout: Sidebar en bas sur mobile, à droite sur desktop */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contenu principal de l'article - EN HAUT sur mobile */}
            <main className="flex-1 min-w-0 order-1 lg:order-1">
              <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
                {/* Image de couverture OPTIMISÉE */}
                {data.cover_image && data.cover_image.trim() !== '' ? (
                  <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-purple-100">
                    <Image
                      src={optimizedCoverImage || data.cover_image}
                      alt={data.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    {/* Balise sémantique pour l'image principale */}
                    <meta itemProp="image" content={data.cover_image} />
                  </div>
                ) : (
                  <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-purple-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                      <BookOpen size={48} className="text-blue-600 opacity-50" />
                    </div>
                  </div>
                )}

                {/* En-tête de l'article */}
                <div className="p-6 md:p-8">
                  {/* Métadonnées */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                      {data.category && (
                        <Link
                          href={`/blog/categorie/${data.category.slug}`}
                          className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors border border-blue-200 w-fit"
                          aria-label={`Voir tous les articles de la catégorie ${data.category.name}`}
                        >
                          {data.category.name}
                        </Link>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} aria-hidden="true" />
                          <time dateTime={publishedAt} itemProp="datePublished">
                            {new Date(publishedAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} aria-hidden="true" />
                          <span>{readingTime} min de lecture</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye size={16} aria-hidden="true" />
                          <span>{data.views || 0} vues</span>
                        </div>
                      </div>
                    </div>
                    <ArticleActions 
                      title={data.title} 
                      excerpt={data.excerpt || ''} 
                    />
                  </div>

                  {/* Titre avec balise sémantique */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight" itemProp="headline">
                    {data.title}
                  </h1>

                  {/* Extrait */}
                  {data.excerpt && (
                    <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed border-l-4 border-blue-500 pl-4 md:pl-6 bg-blue-50/50 py-4 rounded-r-xl" itemProp="description">
                      {data.excerpt}
                    </p>
                  )}

                  {/* Auteur détaillé */}
                  {data.author && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-6 bg-slate-50/50 rounded-2xl mb-8 border border-slate-200" itemProp="author" itemScope itemType="https://schema.org/Person">
                      {data.author.avatar ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
                          <Image
                            src={optimizedAuthorAvatar || data.author.avatar}
                            alt={`Avatar de ${data.author.name}`}
                            fill
                            className="object-cover"
                            itemProp="image"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                          <User size={24} className="text-blue-600" aria-hidden="true" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg" itemProp="name">{data.author.name}</p>
                        {data.author.bio && (
                          <p className="text-sm text-gray-600 mt-1" itemProp="description">{data.author.bio}</p>
                        )}
                        {data.author.role && (
                          <p className="text-xs text-gray-500 mt-1 capitalize bg-white px-2 py-1 rounded-full inline-block border" itemProp="jobTitle">
                            {data.author.role}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu de l'article */}
                <div className="px-6 md:px-8 pb-12">
                  <div
                    className="prose prose-lg max-w-none"
                    itemProp="articleBody"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>

                {/* Section Partage améliorée - APRÈS le contenu */}
                <div className="px-6 md:px-8 pb-8 border-t border-slate-200/50 pt-8">
                  <EnhancedShareSection title={data.title} />
                </div>

                {/* Pied de page de l'article */}
                <div className="px-6 md:px-8 pb-8 border-t border-slate-200/50 pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Mots-clés SEO */}
                    {data.seo_keywords && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                          <Tag size={14} aria-hidden="true" />
                          Mots-clés :
                        </span>
                        {data.seo_keywords.split(',').map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm border border-slate-200"
                            itemProp="keywords"
                          >
                            #{keyword.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {/* Navigation */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                <Link 
                  href="/blog"
                  className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-slate-700 hover:text-slate-900 flex items-center gap-2 group text-center justify-center"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                  Retour au blog
                </Link>
                
                {data.category && (
                  <Link
                    href={`/blog/categorie/${data.category.slug}`}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-slate-700 hover:text-slate-900 flex items-center gap-2 group text-center justify-center"
                  >
                    Plus d'articles dans {data.category.name}
                    <BookOpen size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </main>

            {/* Sidebar - EN BAS sur mobile, À DROITE sur desktop */}
            <aside className="lg:w-80 flex-shrink-0 order-1 lg:order-2">
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Produits Récents */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                  <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Rocket className="text-[#0F23E8]" size={20} aria-hidden="true" />
                    Produits Récents
                  </h2>
                  <p className="text-sm text-slate-600 mb-4">
                    Découvrez nos derniers outils et ressources créés avec IA.
                  </p>
                  <VerticalProductList 
                    limit={4}
                    compact={true}
                    showViewAll={true}
                  />
                </div>

                {/* Statistiques de l'article */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" aria-hidden="true" />
                    Statistiques
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Clock size={14} aria-hidden="true" />
                        Temps de lecture
                      </span>
                      <span className="font-semibold text-slate-900">{readingTime} min</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Eye size={14} aria-hidden="true" />
                        Vues
                      </span>
                      <span className="font-semibold text-slate-900">{data.views || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Calendar size={14} aria-hidden="true" />
                        Publié le
                      </span>
                      <span className="font-semibold text-slate-900 text-right">
                        {new Date(publishedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Catégorie */}
                {data.category && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <BookOpen size={16} className="text-green-600" aria-hidden="true" />
                      Catégorie
                    </h3>
                    <Link
                      href={`/blog/categorie/${data.category.slug}`}
                      className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                      <div className="font-medium text-slate-900">{data.category.name}</div>
                      {data.category.description && (
                        <div className="text-sm text-slate-600 mt-1">{data.category.description}</div>
                      )}
                    </Link>
                  </div>
                )}

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Tag size={16} className="text-purple-600" aria-hidden="true" />
                      Mots-clés
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                          className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm hover:bg-slate-200 transition-colors border border-slate-200"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auteur */}
                {data.author && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <User size={16} className="text-orange-600" aria-hidden="true" />
                      Auteur
                    </h3>
                    <div className="flex items-center gap-3">
                      {data.author.avatar ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
                          <Image
                            src={optimizedAuthorAvatar || data.author.avatar}
                            alt={`Avatar de ${data.author.name}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                          <User size={20} className="text-blue-600" aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{data.author.name}</p>
                        {data.author.role && (
                          <p className="text-xs text-gray-500 capitalize">{data.author.role}</p>
                        )}
                      </div>
                    </div>
                    {data.author.bio && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">{data.author.bio}</p>
                    )}
                    {data.author.social_links && (
                      <div className="flex gap-2 mt-3">
                        {Object.entries(data.author.social_links).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-slate-500 hover:text-slate-700 transition-colors text-xs"
                            aria-label={`Suivre ${data.author?.name} sur ${platform}`}
                          >
                            {platform}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur dans BlogPostPage:', error);
    notFound();
  }
}