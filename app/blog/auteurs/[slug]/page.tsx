// app/blog/auteurs/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/app/utils/supabase/client";

// --- Config
const SITE_URL = "https://epropulse.com";
const SITE_NAME = "Epropulse";

// Image Unsplash de fallback pour les avatars
const UNSPLASH_AVATAR_FALLBACK = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";
const UNSPLASH_COVER_FALLBACK = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";

// --- Types
type Author = {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  role: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
};

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
};

// --- Utils
function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Fonction pour valider les URLs d'images
function getSafeImageUrl(url: string | null, fallback: string): string {
  if (!url || url.trim() === '') {
    return fallback;
  }
  
  try {
    new URL(url);
    return url;
  } catch {
    return fallback;
  }
}

// --- Component principal
export default function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    async function fetchAuthorData() {
      if (!slug) return;

      try {
        setLoading(true);
        const supabase = createClient();
        
        // Get all authors
        const { data: authors, error: authorsError } = await supabase
          .from("authors")
          .select("*");

        if (authorsError) {
          console.error("Error fetching authors:", authorsError);
          return;
        }

        if (!authors || authors.length === 0) {
          return;
        }

        const foundAuthor = authors.find((a) => slugify(a.name) === slug) || null;
        
        if (!foundAuthor) {
          return;
        }

        setAuthor(foundAuthor);

        // Get author's posts
        const { data: postsData, error: postsError } = await supabase
          .from("blog_posts")
          .select("id, slug, title, excerpt, cover_image, published_at")
          .eq("author_id", foundAuthor.id)
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(6);

        if (postsError) {
          console.error("Error fetching posts:", postsError);
          setPosts([]);
        } else {
          setPosts(postsData || []);
        }
      } catch (error) {
        console.error("Error in fetchAuthorData:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthorData();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-10">
        <div className="max-w-5xl mx-auto bg-white/90 border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-slate-200 mb-6 border-4 border-white shadow-sm animate-pulse" />
            <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-32 mb-4 animate-pulse" />
            <div className="h-20 bg-slate-200 rounded w-full max-w-2xl animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!author) {
    return notFound();
  }

  const url = `${SITE_URL}/blog/auteurs/${slug}`;
  const authorAvatar = getSafeImageUrl(author.avatar, UNSPLASH_AVATAR_FALLBACK);

  // --- JSON-LD Schema
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#author`,
    name: author.name,
    description: author.bio || undefined,
    image: authorAvatar,
    jobTitle: author.role || undefined,
    url,
    sameAs: author.social_links ? Object.values(author.social_links).filter(Boolean) : [],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: "Auteurs", item: `${SITE_URL}/blog/auteurs` },
      { "@type": "ListItem", position: 4, name: author.name, item: url },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-10">
      {/* --- Structured Data --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="max-w-5xl mx-auto bg-white/90 border border-slate-200 rounded-2xl p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-200 mb-6 border-4 border-white shadow-sm">
            <Image
              src={authorAvatar}
              alt={`Avatar de ${author.name}`}
              fill
              className="object-cover"
              priority
              sizes="128px"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">{author.name}</h1>
          {author.role && (
            <p className="text-blue-600 text-sm mt-1 capitalize">{author.role}</p>
          )}
          {author.bio && (
            <p className="text-slate-700 mt-4 max-w-2xl leading-relaxed">
              {author.bio}
            </p>
          )}

          {/* Social links */}
          {author.social_links && Object.keys(author.social_links).length > 0 && (
            <div className="flex gap-4 mt-6 flex-wrap justify-center">
              {Object.entries(author.social_links)
                .filter(([_, link]) => link && typeof link === 'string')
                .map(([platform, link]) => (
                  <a
                    key={platform}
                    href={link as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-blue-600 text-sm capitalize bg-slate-100 px-3 py-1 rounded-full transition-colors"
                  >
                    {platform}
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* Articles Section */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Articles récents de {author.name}
          </h2>

          {!posts || posts.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Aucun article publié pour le moment.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => {
                const postCover = getSafeImageUrl(post.cover_image, UNSPLASH_COVER_FALLBACK);
                
                return (
                  <li key={post.id} className="group">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group-hover:border-blue-200"
                    >
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 bg-slate-100">
                        <Image
                          src={postCover}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        {new Date(post.published_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/blog/auteurs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm underline transition-colors"
          >
            ← Retour à la liste des auteurs
          </Link>
        </div>
      </div>
    </main>
  );
}