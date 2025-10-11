import { createClient } from "@supabase/supabase-js";
import { transformMarkdownToHtml } from "@/app/utils/markdown";
import { notFound } from "next/navigation";
import Image from "next/image";
import RecentProducts from "@/app/components/Products/RecentProducts";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowLeft, User, Tag } from "lucide-react";
import ArticleActions from '@/app/components/Bloging/ArticleActions';
import SocialShareButtons from '@/app/components/Bloging/SocialShareButtons';

// --- Configuration
export const revalidate = 3600;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Types basés sur votre structure Supabase exacte
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published_at: string | null;
  updated_at: string;
  views: number;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  author_id: string | null;
  category_id: number | null;
  author?: {
    id: string;
    name: string;
    bio: string | null;
    avatar: string | null;
    role: string;
    social_links: any;
  };
  category?: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
  };
  tags?: {
    id: number;
    slug: string;
    name: string;
  }[];
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// --- Fonction pour récupérer l'article avec toutes les relations
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  console.log('🔍 Recherche de l\'article:', slug);
  
  try {
    // Récupération de l'article de base avec relations
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select(`
        *,
        author:authors(*),
        category:blog_categories(*)
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (postError) {
      console.error('❌ Erreur Supabase (post):', postError);
      return null;
    }

    if (!post) {
      console.log('❌ Aucun article trouvé pour le slug:', slug);
      return null;
    }

    // Récupération des tags séparément via la table de liaison - CORRIGÉ
    const { data: tagsData, error: tagsError } = await supabase
      .from("blog_post_tags")
      .select(`
        blog_tags(id, slug, name)
      `)
      .eq("post_id", post.id);

    if (tagsError) {
      console.error('❌ Erreur Supabase (tags):', tagsError);
    }

    console.log('✅ Article trouvé:', post.title);
    
    // Transformation des tags - CORRECTION
    // Certains items retournent `blog_tags` comme tableau, on aplatit tout puis on filtre
    const tags = (tagsData ?? []).flatMap((item: any) => (item.blog_tags ?? [])).filter(
      (tag): tag is { id: number; slug: string; name: string } =>
        !!tag && typeof tag === 'object' && 'id' in tag && 'slug' in tag && 'name' in tag
    );

    // Transformation des données pour correspondre à l'interface
    const transformedData: BlogPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image,
      published_at: post.published_at,
      updated_at: post.updated_at,
      views: post.views,
      is_published: post.is_published,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      seo_keywords: post.seo_keywords,
      author_id: post.author_id,
      category_id: post.category_id,
      author: post.author ? {
        id: post.author.id,
        name: post.author.name,
        bio: post.author.bio,
        avatar: post.author.avatar,
        role: post.author.role,
        social_links: post.author.social_links
      } : undefined,
      category: post.category ? {
        id: post.category.id,
        slug: post.category.slug,
        name: post.category.name,
        description: post.category.description
      } : undefined,
      tags: tags
    };

    return transformedData;

  } catch (error) {
    console.error('💥 Erreur lors de la récupération:', error);
    return null;
  }
}

// --- Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await getBlogPost(slug);

    if (!data) {
      return {
        title: "Article non trouvé",
        description: "Cet article n'existe pas ou a été supprimé.",
      };
    }

    const title = data.seo_title || data.title;
    const description = data.seo_description || data.excerpt || "Découvrez cet article intéressant";

    return {
      title,
      description,
      keywords: data.seo_keywords || undefined,
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: data.published_at || undefined,
        modifiedTime: data.updated_at,
        authors: data.author ? [data.author.name] : undefined,
        tags: data.tags?.map(tag => tag.name) || undefined,
        images: data.cover_image ? [{ 
          url: data.cover_image,
          width: 1200,
          height: 630,
          alt: data.title
        }] : [],
      },
    };
  } catch (error) {
    console.error('Erreur generateMetadata:', error);
    return {
      title: "Article",
      description: "Lire cet article",
    };
  }
}

// --- Génération des slugs statiques
export async function generateStaticParams() {
  try {
    console.log('📝 Génération des slugs statiques...');
    
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("is_published", true)
      .limit(50);

    if (error) {
      console.error('Erreur generateStaticParams:', error);
      return [];
    }

    const params = posts?.map((post) => ({
      slug: post.slug,
    })) || [];

    console.log(`✅ ${params.length} slugs générés`);
    return params;

  } catch (error) {
    console.error('Erreur generateStaticParams:', error);
    return [];
  }
}

// --- Composant principal
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  console.log('🚀 Chargement de la page pour le slug:', slug);

  const data = await getBlogPost(slug);

  if (!data) {
    console.log('❌ Article non trouvé, redirection vers 404');
    notFound();
  }

  // Fonctions pour les boutons - CORRIGÉ
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.excerpt || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const handleBookmark = () => {
    // Implémentation basique de bookmark
    alert('Article ajouté aux favoris !');
  };

  try {
    // Transformation du contenu markdown
    const htmlContent = await transformMarkdownToHtml(data.content || "");
    
    // Calcul du temps de lecture
    const readingTime = Math.max(1, Math.ceil((data.content?.split(/\s+/).length || 0) / 200));
    const publishedAt = data.published_at || data.updated_at;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Navigation */}
          <nav className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Retour au blog
            </Link>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* En-tête sidebar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Produits Récents
                  </h3>
                  <p className="text-sm text-slate-600">
                    Découvrez nos derniers produits
                  </p>
                </div>

                {/* RecentProducts */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
                  <RecentProducts />
                </div>

                {/* Stats de l'article */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-4">Statistiques</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Temps de lecture</span>
                      <span className="font-semibold text-slate-900">{readingTime} min</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Vues</span>
                      <span className="font-semibold text-slate-900">{data.views || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Publié le</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(publishedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Tag size={16} />
                      Mots-clés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                          className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm hover:bg-slate-200 transition-colors"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Contenu principal de l'article */}
            <main className="flex-1 min-w-0">
              <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
                {/* Image de couverture */}
                {data.cover_image && (
                  <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-purple-100">
                    <Image
                      src={data.cover_image}
                      alt={data.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 70vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                )}

                {/* En-tête de l'article */}
                <div className="p-8">
                  {/* Catégorie et métadonnées */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      {data.category && (
                        <Link
                          href={`/blog?category=${encodeURIComponent(data.category.slug)}`}
                          className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          {data.category.name}
                        </Link>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
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
                          <span>{data.views || 0} vues</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions - CORRIGÉ avec gestion d'événements */}
                    <ArticleActions title={data.title} excerpt={data.excerpt || ''} />
                  </div>

                  {/* Titre */}
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {data.title}
                  </h1>

                  {/* Extrait */}
                  {data.excerpt && (
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed border-l-4 border-blue-500 pl-6">
                      {data.excerpt}
                    </p>
                  )}

                  {/* Auteur */}
                  {data.author && (
                    <div className="flex items-center gap-4 p-6 bg-slate-50/50 rounded-2xl mb-8">
                      {data.author.avatar ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200">
                          <Image
                            src={data.author.avatar}
                            alt={data.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={24} className="text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{data.author.name}</p>
                        {data.author.bio && (
                          <p className="text-sm text-gray-600 mt-1">{data.author.bio}</p>
                        )}
                        {data.author.role && (
                          <p className="text-xs text-gray-500 mt-1 capitalize">{data.author.role}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu de l'article */}
                <div className="px-8 pb-12">
                  <div
                    className="prose prose-lg max-w-none
                      prose-headings:text-slate-900 prose-headings:font-bold
                      prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                      prose-p:text-slate-700 prose-p:leading-relaxed
                      prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline
                      prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-xl
                      prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:border-0 prose-pre:rounded-xl
                      prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
                      prose-ul:list-none prose-ul:space-y-2
                      prose-li:flex prose-li:items-start prose-li:gap-3
                      prose-li:before:content-[''] prose-li:before:w-2 prose-li:before:h-2 prose-li:before:bg-blue-500 prose-li:before:rounded-full prose-li:before:mt-2 prose-li:before:flex-shrink-0
                      prose-strong:text-slate-900 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>

                {/* Mots-clés SEO et partage */}
                <div className="px-8 pb-8 border-t border-slate-200/50 pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {data.seo_keywords && (
                      <div className="flex flex-wrap gap-2">
                        {data.seo_keywords.split(',').map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm"
                          >
                            #{keyword.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">Partager :</span>
                      {/* Social share buttons (client component) */}
                      <SocialShareButtons title={data.title} />
                    </div>
                  </div>
                </div>
              </article>

              {/* Navigation entre articles */}
              <div className="mt-8 flex justify-between">
                <Link 
                  href="/blog"
                  className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-slate-700 hover:text-slate-900"
                >
                  ← Retour au blog
                </Link>
                <Link
                  href="#"
                  className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-slate-700 hover:text-slate-900"
                >
                  Article suivant →
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Erreur lors du rendu de l\'article:', error);
    notFound();
  }
}