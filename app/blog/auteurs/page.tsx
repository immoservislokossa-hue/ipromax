// app/blog/auteurs/page.tsx
import { createServerSupabaseClient } from "@/app/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

const SITE_URL = "https://epropulse.com";
const SITE_NAME = "Epropulse";

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

export const metadata: Metadata = {
  title: "Auteurs du blog — Epropulse",
  description:
    "Découvrez les auteurs du blog Epropulse : créateurs, entrepreneurs et experts du digital qui partagent leur savoir pour propulser votre croissance.",
  alternates: { canonical: `${SITE_URL}/blog/auteurs` },
  openGraph: {
    title: "Auteurs du blog — Epropulse",
    description:
      "Rencontrez nos auteurs et explorez leurs contributions sur le marketing, la technologie et l'entrepreneuriat.",
    url: `${SITE_URL}/blog/auteurs`,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auteurs du blog — Epropulse",
    description: "Découvrez l’équipe éditoriale du blog Epropulse.",
  },
  robots: { index: true, follow: true, maxSnippet: -1, maxImagePreview: "large" },
};

export default async function AuthorsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: authors } = await supabase.from("authors").select("*").order("created_at", { ascending: false });

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
    itemListElement: (authors || []).map((a: Author, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/auteurs/${slugify(a.name)}`,
      name: a.name,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Nos Auteurs</h1>
          <p className="text-slate-600 mt-2">
            L’équipe qui propulse vos idées. Experts, créateurs et entrepreneurs passionnés du digital.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(authors || []).map((author) => {
            const slug = slugify(author.name);
            return (
              <Link
                key={author.id}
                href={`/blog/auteurs/${slug}`}
                className="bg-white/80 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-200 mb-4">
                    {author.avatar ? (
                      <Image src={author.avatar} alt={author.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-slate-400 text-2xl font-bold">
                        {author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{author.name}</h2>
                  {author.role && <p className="text-blue-600 text-sm capitalize">{author.role}</p>}
                  {author.bio && <p className="text-slate-600 text-sm mt-2 line-clamp-3">{author.bio}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
