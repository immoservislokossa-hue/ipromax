'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BlogPreviewCard from './BlogPreviewCard';

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
  category?: { name: string } | null;
}

export default function RecentBlogPosts() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id,
            slug,
            title,
            excerpt,
            cover_image,
            created_at,
            category:blog_categories(name)
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        // ✅ Correction ici : aplatir la catégorie (de tableau à objet simple)
        const normalizedData =
          (data || []).map((post: any) => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            cover_image: post.cover_image,
            created_at: post.created_at,
            category:
              Array.isArray(post.category) && post.category.length > 0
                ? post.category[0]
                : { name: 'Non catégorisé' },
          })) ?? [];

        setBlogs(normalizedData);
      } catch (err: any) {
        console.error('Erreur récupération blogs récents:', err.message || err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

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
        <p className="text-gray-500">Aucun article disponible pour le moment.</p>
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
            excerpt={blog.excerpt || ''}
            cover_image={blog.cover_image || '/default-article-image.jpg'}
            category_name={blog.category?.name || 'Non catégorisé'}
            published_at={blog.created_at}
          />
        ))}
      </div>
    </section>
  );
}
