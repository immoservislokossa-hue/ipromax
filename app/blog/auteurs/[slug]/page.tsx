import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/app/utils/supabase/server";

// --- Config
export const revalidate = 3600;
const SITE_URL = "https://epropulse.com";
const SITE_NAME = "Epropulse";

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

// --- Utils
function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// --- Data Fetching (Server Side)
async function getAuthorData(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("authors").select("*");
  const author = data?.find((a) => slugify(a.name) === slug) || null;
  if (!author) return null;

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image, published_at")
    .eq("author_id", author.id)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(6);

  return { author, posts: posts || [] };
}

// --- Static params for prebuild
export async function generateStaticParams() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("authors").select("name");
  return data?.map((a) => ({ slug: slugify(a.name) })) || [];
}

// --- Metadata SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // ✅ correction : params est asynchrone
  const result = await getAuthorData(slug);
  if (!result) {
    return {
      title: "Auteur introuvable — Epropulse",
      description: "Profil non trouvé",
      robots: { index: false, follow: false },
    };
  }

  const { author } = result;
  const url = `${SITE_URL}/blog/auteurs/${slug}`;
  const desc =
    author.bio ||
    `Profil, articles et expertise de ${author.name} sur ${SITE_NAME}.`;

  return {
    title: `${author.name} — Auteur sur ${SITE_NAME}`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${author.name} — Auteur sur ${SITE_NAME}`,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: "profile",
      locale: "fr_FR",
      images: author.avatar
        ? [{ url: author.avatar, width: 600, height: 600, alt: author.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: author.name,
      description: desc,
      images: author.avatar ? [author.avatar] : [],
    },
    robots: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  };
}

// --- Component principal
export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ correction : params est asynchrone
  const result = await getAuthorData(slug);
  if (!result) return notFound();

  const { author, posts } = result;
  const url = `${SITE_URL}/blog/auteurs/${slug}`;

  // --- JSON-LD Schema
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#author`,
    name: author.name,
    description: author.bio || undefined,
    image: author.avatar || `${SITE_URL}/default-avatar.png`, // ✅ fallback image
    jobTitle: author.role || undefined,
    url,
    sameAs: author.social_links ? Object.values(author.social_links) : [],
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
              src={author.avatar || "/default-avatar.png"} // ✅ fallback local
              alt={author.name}
              fill
              className="object-cover"
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
          {author.social_links && (
            <div className="flex gap-4 mt-6">
              {Object.entries(author.social_links).map(([platform, link]) => (
                <a
                  key={platform}
                  href={String(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-blue-600 text-sm capitalize"
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

          {!posts.length ? (
            <p className="text-slate-500 text-sm">
              Aucun article publié pour le moment.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    {p.cover_image && (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 bg-slate-100">
                        <Image
                          src={p.cover_image}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {p.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(p.published_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/blog/auteurs"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            ← Retour à la liste des auteurs
          </Link>
        </div>
      </div>
    </main>
  );
}
