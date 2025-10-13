"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BlogPreviewCard from "./BlogPreviewCard";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  category_name: string;
}

interface RecentBlogPostsProps {
  limit?: number; // ✅ nouvelle prop optionnelle
}

export default function RecentBlogPosts({ limit = 8 }: RecentBlogPostsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchBlogs() {
      try {
        if (!isMounted) return;
        setLoading(true);

        const { data, error } = await supabase
          .from("published_blog_posts")
          .select(`
            id,
            slug,
            title,
            excerpt,
            cover_image,
            published_at,
            category_name
          `)
          .order("published_at", { ascending: false })
          .limit(limit); // ✅ utilisation dynamique du paramètre

        if (error) throw error;

        const normalizedData = (data || []).map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || "",
          cover_image: post.cover_image || null,
          published_at: post.published_at || new Date().toISOString(),
          category_name: post.category_name || "Non catégorisé",
        }));

        if (isMounted) setBlogs(normalizedData);
      } catch (err: any) {
        console.error("Erreur récupération blogs récents:", err.message || err);
        if (isMounted) setBlogs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, [limit]); // ✅ re-fetch si la limite change

  if (loading) {
    return (
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0F23E8]">
          Articles récents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!blogs.length) {
    return (
      <section className="my-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#0F23E8]">Articles récents</h2>
        <p className="text-gray-500">
          Aucun article disponible pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#0F23E8]">
        Articles récents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <BlogPreviewCard
            key={blog.id}
            id={blog.id}
            slug={blog.slug}
            title={blog.title}
            excerpt={blog.excerpt}
            cover_image={blog.cover_image || "/default-article-image.jpg"}
            category_name={blog.category_name}
            published_at={blog.published_at}
          />
        ))}
      </div>
    </section>
  );
}
