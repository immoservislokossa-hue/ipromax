// app/blog/auteurs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://epropulse.com";
const SITE_NAME = "Epropulse";

// Image Unsplash de fallback pour les avatars
const UNSPLASH_AVATAR_FALLBACK = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";

type Author = {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  role: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("authors")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching authors:", error);
          return;
        }

        setAuthors(data || []);
      } catch (error) {
        console.error("Error in fetchAuthors:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthors();
  }, []);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: "Auteurs", item: `${SITE_URL}/blog/auteurs` },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: authors.map((author, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/auteurs/${slugify(author.name)}`,
      name: author.name,
    })),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <header className="text-center mb-8">
            <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-96 mx-auto animate-pulse" />
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 border border-slate-200 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-200 mb-4" />
                  <div className="h-6 bg-slate-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                  <div className="h-12 bg-slate-200 rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Nos Auteurs</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            L'équipe qui propulse vos idées. Experts, créateurs et entrepreneurs passionnés du digital.
          </p>
        </header>

        {authors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Aucun auteur trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => {
              const slug = slugify(author.name);
              const authorAvatar = getSafeImageUrl(author.avatar, UNSPLASH_AVATAR_FALLBACK);
              
              return (
                <Link
                  key={author.id}
                  href={`/blog/auteurs/${slug}`}
                  className="bg-white/80 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 hover:scale-105 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-200 mb-4 border-2 border-white group-hover:border-blue-100 transition-colors">
                      <Image
                        src={authorAvatar}
                        alt={`Avatar de ${author.name}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {author.name}
                    </h2>
                    {author.role && (
                      <p className="text-blue-600 text-sm capitalize mt-1">
                        {author.role}
                      </p>
                    )}
                    {author.bio && (
                      <p className="text-slate-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                        {author.bio}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}