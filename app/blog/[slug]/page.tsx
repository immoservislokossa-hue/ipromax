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
  TrendingUp,
  ChevronRight
} from "lucide-react";
import ArticleActions from '@/app/components/Bloging/ArticleActions';
import SocialShareButtons from '@/app/components/Bloging/SocialShareButtons';
import SEO from '@/app/components/Seo';

// --- Configuration
export const revalidate = 3600; // Revalidation toutes les heures

interface PageProps {
  // Match Next's generated type: params may be a Promise resolving to the segment params.
  params?: Promise<{ slug: string }>;
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

// --- Schema.org Data pour un SEO optimal
function generateArticleSchema(post: BlogPost, htmlContent: string) {
  const cleanContent = htmlContent.replace(/<[^>]*>/g, '').substring(0, 5000);
  const wordCount = post.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  return {
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
      jobTitle: post.author?.role,
      image: post.author?.avatar,
      description: post.author?.bio,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Epropulse',
      url: 'https://epropulse.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://epropulse.com/logo.png',
        width: 180,
        height: 60,
      },
      sameAs: [
        'https://twitter.com/epropulse',
        'https://linkedin.com/company/epropulse',
        'https://facebook.com/epropulse'
      ]
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://epropulse.com/blog/${post.slug}`,
    },
    articleSection: post.category?.name,
    articleBody: cleanContent,
    keywords: post.seo_keywords || post.tags?.map(tag => tag.name).join(', '),
    wordCount: wordCount,
    inLanguage: 'fr-FR',
    timeRequired: `PT${readingTime}M`,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/ReadAction',
      userInteractionCount: post.views || 0
    }
  };
}

function generateBreadcrumbSchema(post: BlogPost, category?: Category) {
  return {
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
}

function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Epropulse',
    url: 'https://epropulse.com',
    description: 'Epropulse aide les créateurs, entrepreneurs et entreprises francophones à utiliser l\'IA et le digital pour accélérer leur croissance',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://epropulse.com/blog?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

// --- Metadata PERFECTIONNÉE pour le SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!params) throw new Error('Missing params');
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
    const authors = data.author ? [{ name: data.author.name }] : undefined;
    const tags = data.tags?.map(tag => tag.name) || undefined;
    const url = `https://epropulse.com/blog/${data.slug}`;
    const image = data.cover_image || 'https://epropulse.com/og-image-default.jpg';
    
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
        authors: data.author ? [data.author.name] : undefined,
        tags,
        url,
        siteName: "Epropulse",
        locale: "fr_FR",
        images: [{ 
          url: image,
          width: 1200,
          height: 630,
          alt: data.title // Alt optimisé avec le titre de l'article
        }],
      },
      twitter: {
        card: data.cover_image ? 'summary_large_image' : 'summary',
        title,
        description,
        images: [image],
        creator: data.author ? `@${data.author.name.replace(/\s+/g, '')}` : '@epropulse',
        site: '@epropulse',
      },
      verification: {
        google: 'votre-code-verification-google',
        yandex: 'votre-code-verification-yandex',
        yahoo: 'votre-code-verification-yahoo',
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

// --- Génération des slugs statiques pour le SSG
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

// --- Fonction d'optimisation Cloudinary pour les images
function getOptimizedImageUrl(imageUrl: string | null, options: { width?: number; height?: number; quality?: number } = {}) {
  if (!imageUrl) return null;
  
  if (imageUrl.includes('cloudinary.com') && !imageUrl.includes('/upload/')) {
    return imageUrl;
  }
  
  if (imageUrl.includes('res.cloudinary.com')) {
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const baseUrl = imageUrl.substring(0, uploadIndex + 8);
      const restOfUrl = imageUrl.substring(uploadIndex + 8);
      
      const transformations = [];
      if (options.width) transformations.push(`w_${options.width}`);
      if (options.height) transformations.push(`h_${options.height}`);
      transformations.push('c_fill');
      transformations.push('q_auto:good');
      transformations.push('f_auto');
      transformations.push('dpr_2.0'); // Optimisation pour les écrans retina
      
      return `${baseUrl}/${transformations.join(',')}/${restOfUrl}`;
    }
  }
  
  return imageUrl;
}

// --- Composant pour la section Partage améliorée
function EnhancedShareSection({ title, url }: { title: string; url: string }) {
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
          url={url}
          variant="colored"
        />
      </div>
    </div>
  );
}

// --- Composant principal PERFECTIONNÉ pour le SEO
export default async function BlogPostPage({ params }: PageProps) {
  if (!params) notFound();
  const { slug } = await params;
  const data = await getBlogPostWithRelations(slug);
  
  if (!data) {
    notFound();
  }

  try {
    const htmlContent = await transformMarkdownToHtml(data.content || "");
    const readingTime = Math.max(1, Math.ceil((data.content?.split(/\s+/).length || 0) / 200));
    const publishedAt = data.published_at || data.updated_at;
    
    // URLs optimisées pour les images
    const optimizedCoverImage = getOptimizedImageUrl(data.cover_image, { width: 1200, height: 630 });
    const optimizedAuthorAvatar = getOptimizedImageUrl(data.author?.avatar || null, { width: 100, height: 100 });
    
    // Données SEO optimisées
    const seoTitle = data.seo_title || data.title;
    const seoDescription = data.seo_description || data.excerpt || `Découvrez "${data.title}" - un article complet sur Epropulse.`;
    const canonicalUrl = `https://epropulse.com/blog/${data.slug}`;
    const seoImage = data.cover_image || 'https://epropulse.com/og-image-default.jpg';
    
    // Schemas structurés complets
    const articleSchema = generateArticleSchema(data, htmlContent);
    const breadcrumbSchema = generateBreadcrumbSchema(data, data.category);
    const websiteSchema = generateWebsiteSchema();

    return (
      <>
        {/* SEO Ultra-Optimisé */}
        <SEO
          title={seoTitle}
          description={seoDescription}
          canonical={canonicalUrl}
          image={seoImage}
          type="article"
          publishedTime={data.published_at}
          modifiedTime={data.updated_at}
          keywords={data.seo_keywords || undefined}
          schema={articleSchema}
        />
        
        {/* Structured Data supplémentaires */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          {/* Balise main pour l'accessibilité */}
          <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb Navigation optimisée pour le SEO */}
            <nav aria-label="Fil d'Ariane" className="mb-8 lg:mb-12">
              <ol className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
                <li>
                  <Link 
                    href="/" 
                    className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                    aria-label="Retour à l'accueil"
                  >
                    Accueil
                  </Link>
                </li>
                <li className="flex items-center gap-2" aria-hidden="true">
                  <ChevronRight size={14} className="text-slate-400" />
                  <Link 
                    href="/blog" 
                    className="hover:text-blue-600 transition-colors duration-200"
                    aria-label="Voir tous les articles du blog"
                  >
                    Blog
                  </Link>
                </li>
                {data.category && (
                  <li className="flex items-center gap-2" aria-hidden="true">
                    <ChevronRight size={14} className="text-slate-400" />
                    <Link 
                      href={`/blog/categorie/${data.category.slug}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                      aria-label={`Voir les articles de la catégorie ${data.category.name}`}
                    >
                      {data.category.name}
                    </Link>
                  </li>
                )}
                <li className="flex items-center gap-2" aria-current="page">
                  <ChevronRight size={14} className="text-slate-400" />
                  <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                    {data.title}
                  </span>
                </li>
              </ol>
            </nav>
            
            {/* Layout responsive avec balises sémantiques */}
            <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
              {/* Contenu principal - 70% de largeur sur desktop */}
              <article className="flex-1 min-w-0 xl:max-w-[70%]" itemScope itemType="https://schema.org/BlogPosting">
                {/* Balises meta cachées pour le SEO */}
                <meta itemProp="datePublished" content={data.published_at} />
                <meta itemProp="dateModified" content={data.updated_at} />
                <meta itemProp="author" content={data.author?.name || 'Epropulse'} />
                <meta itemProp="publisher" content="Epropulse" />
                <meta itemProp="image" content={data.cover_image || 'https://epropulse.com/og-image-default.jpg'} />
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-sm border border-white/20 overflow-hidden">
                  {/* Image de couverture OPTIMISÉE pour le SEO avec alt = nom de l'article */}
                  {data.cover_image && data.cover_image.trim() !== '' ? (
                    <figure className="relative h-64 sm:h-80 md:h-96 lg:h-[480px] bg-gradient-to-br from-blue-100 to-purple-100">
                      <Image
                        src={optimizedCoverImage || data.cover_image}
                        alt={data.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                        itemProp="image"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      <figcaption className="sr-only">Image de couverture de l'article : {data.title}</figcaption>
                    </figure>
                  ) : (
                    <div className="relative h-64 sm:h-80 md:h-96 lg:h-[480px] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <BookOpen size={64} className="text-blue-600 opacity-30" aria-hidden="true" />
                    </div>
                  )}

                  {/* En-tête de l'article avec métadonnées structurées */}
                  <header className="p-6 sm:p-8 lg:p-10">
                    {/* Métadonnées de l'article */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                        {data.category && (
                          <Link
                            href={`/blog/categorie/${data.category.slug}`}
                            className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200 border border-blue-200 w-fit"
                            aria-label={`Voir tous les articles de la catégorie ${data.category.name}`}
                            itemProp="articleSection"
                          >
                            {data.category.name}
                          </Link>
                        )}
                        <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                          <div className="flex items-center gap-1.5" itemProp="datePublished">
                            <Calendar size={16} aria-hidden="true" />
                            <time dateTime={publishedAt}>
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
                          <div className="flex items-center gap-1.5" itemProp="interactionStatistic">
                            <Eye size={16} aria-hidden="true" />
                            <span>{(data.views || 0).toLocaleString()} vues</span>
                          </div>
                        </div>
                      </div>
                      <ArticleActions 
                        title={data.title} 
                        excerpt={data.excerpt || ''} 
                      />
                    </div>

                    {/* Titre principal avec balise sémantique */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight" itemProp="headline">
                      {data.title}
                    </h1>

                    {/* Extrait de l'article */}
                    {data.excerpt && (
                      <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed border-l-4 border-blue-500 pl-4 sm:pl-6 bg-blue-50/50 py-4 rounded-r-xl" itemProp="description">
                        {data.excerpt}
                      </p>
                    )}

                    {/* Auteur détaillé avec microdonnées */}
                    {data.author && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 bg-slate-50/50 rounded-2xl mb-8 border border-slate-200" itemProp="author" itemScope itemType="https://schema.org/Person">
                        {data.author.avatar ? (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex-shrink-0">
                            <Image
                              src={optimizedAuthorAvatar || data.author.avatar}
                              alt={data.author.name} 
                              fill
                              className="object-cover"
                              itemProp="image"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                            <User size={24} className="text-blue-600" aria-hidden="true" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-lg truncate" itemProp="name">{data.author.name}</p>
                          {data.author.bio && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2" itemProp="description">{data.author.bio}</p>
                          )}
                          {data.author.role && (
                            <p className="text-xs text-gray-500 mt-1 capitalize bg-white px-2 py-1 rounded-full inline-block border" itemProp="jobTitle">
                              {data.author.role}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </header>

                  {/* Contenu principal de l'article */}
                  <section className="px-6 sm:px-8 lg:px-10 pb-12">
                    <div
                      className="prose prose-lg max-w-none 
                                prose-headings:font-bold prose-headings:text-slate-900 prose-headings:scroll-mt-20
                                prose-p:text-slate-700 prose-p:leading-relaxed
                                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-xl
                                prose-ul:text-slate-700 prose-ol:text-slate-700
                                prose-li:marker:text-blue-500
                                prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded
                                prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl
                                prose-img:rounded-xl prose-img:shadow-sm prose-img:mx-auto
                                prose-table:border-collapse prose-table:border prose-table:border-slate-300
                                prose-th:bg-slate-100 prose-th:text-slate-900
                                prose-td:border prose-td:border-slate-300"
                      itemProp="articleBody"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </section>

                  {/* Section Partage optimisée pour l'engagement */}
                  <footer className="px-6 sm:px-8 lg:px-10 pb-8 border-t border-slate-200/50 pt-8">
                    <EnhancedShareSection title={data.title} url={canonicalUrl} />
                  </footer>

                  {/* Mots-clés SEO pour le référencement */}
                  {data.seo_keywords && (
                    <div className="px-6 sm:px-8 lg:px-10 pb-8 border-t border-slate-200/50 pt-8">
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
                    </div>
                  )}
                </div>

                {/* Navigation entre articles */}
                <nav className="mt-8 flex flex-col sm:flex-row gap-4 justify-between" aria-label="Navigation de l'article">
                  <Link 
                    href="/blog"
                    className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-slate-700 hover:text-slate-900 flex items-center gap-2 group text-center justify-center"
                    aria-label="Retour à la liste des articles"
                  >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                    Retour au blog
                  </Link>
                  
                  {data.category && (
                    <Link
                      href={`/blog/categorie/${data.category.slug}`}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-slate-700 hover:text-slate-900 flex items-center gap-2 group text-center justify-center"
                      aria-label={`Voir plus d'articles dans la catégorie ${data.category.name}`}
                    >
                      Plus d'articles dans {data.category.name}
                      <BookOpen size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                    </Link>
                  )}
                </nav>
              </article>

              {/* Sidebar avec contenu complémentaire - 30% de largeur sur desktop */}
              <aside className="xl:w-[30%] flex-shrink-0" aria-label="Informations complémentaires">
                <div className="xl:sticky xl:top-8 space-y-6">
                  {/* Produits Récents pour la monétisation */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
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
                  </section>

                  {/* Statistiques de l'article pour l'engagement */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
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
                        <span className="font-semibold text-slate-900">{(data.views || 0).toLocaleString()}</span>
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
                  </section>

                  {/* Catégorie pour la navigation contextuelle */}
                  {data.category && (
                    <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <BookOpen size={16} className="text-green-600" aria-hidden="true" />
                        Catégorie
                      </h3>
                      <Link
                        href={`/blog/categorie/${data.category.slug}`}
                        className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200 border border-slate-200"
                        aria-label={`Explorer la catégorie ${data.category.name}`}
                      >
                        <div className="font-medium text-slate-900">{data.category.name}</div>
                        {data.category.description && (
                          <div className="text-sm text-slate-600 mt-1 line-clamp-2">{data.category.description}</div>
                        )}
                      </Link>
                    </section>
                  )}

                  {/* Tags pour le référencement sémantique */}
                  {data.tags && data.tags.length > 0 && (
                    <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Tag size={16} className="text-purple-600" aria-hidden="true" />
                        Mots-clés
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.tags.slice(0, 10).map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                            className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm hover:bg-slate-200 transition-colors duration-200 border border-slate-200"
                            aria-label={`Voir les articles avec le tag ${tag.name}`}
                          >
                            #{tag.name}
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Auteur pour l'E-A-T (Expertise, Authoritativeness, Trustworthiness) */}
                  {data.author && (
                    <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <User size={16} className="text-orange-600" aria-hidden="true" />
                        Auteur
                      </h3>
                      <div className="flex items-center gap-3">
                        {data.author.avatar ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex-shrink-0">
                            <Image
                              src={optimizedAuthorAvatar || data.author.avatar}
                              alt={data.author.name} 
                                    fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                            <User size={20} className="text-blue-600" aria-hidden="true" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{data.author.name}</p>
                          {data.author.role && (
                            <p className="text-xs text-gray-500 capitalize truncate">{data.author.role}</p>
                          )}
                        </div>
                      </div>
                      {data.author.bio && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3">{data.author.bio}</p>
                      )}
                      {data.author.social_links && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {Object.entries(data.author.social_links).slice(0, 3).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="text-slate-500 hover:text-slate-700 transition-colors duration-200 text-xs bg-slate-100 px-2 py-1 rounded"
                              aria-label={`Suivre ${data.author?.name} sur ${platform}`}
                            >
                              {platform}
                            </a>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                </div>
              </aside>
            </div>
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error('Erreur dans BlogPostPage:', error);
    notFound();
  }
}