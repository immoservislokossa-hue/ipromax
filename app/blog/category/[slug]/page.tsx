// app/blog/category/[slug]/page.tsx
import { createClient } from "@supabase/supabase-js";
import BlogPreviewCard from "@/app/components/Bloging/BlogPreviewCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: any) {
  const { slug } = params;

  const { data: articles, error } = await supabase
    .from("blog_posts")
    .select(`
      id,
      slug,
      title,
      excerpt,
      cover_image,
      category:blog_categories(name),
      created_at
    `)
    .eq("category:slug", slug)
    .order("created_at", { ascending: false });

  if (error || !articles || articles.length === 0) notFound();

  return (
    <section className="max-w-6xl mx-auto py-8 px-2 sm:px-4 md:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Articles dans la catégorie "{articles[0]?.category?.[0]?.name || slug}"
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: any) => {
          const categoryName = article.category?.[0]?.name || "Non catégorisé";
          return (
            <BlogPreviewCard
              key={article.id}
              id={article.id}
              slug={article.slug}                    // obligatoire pour BlogPreviewCard
              title={article.title}
              excerpt={article.excerpt}
              cover_image={article.cover_image}      // correction ici
              published_at={article.created_at}      // correction ici
              category_name={categoryName}           // correction ici
            />
          );
        })}
      </div>
    </section>
  );
}

// generateMetadata
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;

  const { data: articles } = await supabase
    .from("blog_posts")
    .select("category:blog_categories(name)")
    .eq("category:slug", slug)
    .limit(1)
    .single();

  const categoryName = articles?.category?.[0]?.name || slug;

  return {
    title: `Articles dans la catégorie "${categoryName}"`,
    description: `Découvrez tous les articles récents de la catégorie "${categoryName}".`,
    openGraph: {
      title: `Articles dans la catégorie "${categoryName}"`,
      description: `Découvrez tous les articles récents de la catégorie "${categoryName}".`,
    },
  };
}
