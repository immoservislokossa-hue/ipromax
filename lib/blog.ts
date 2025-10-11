import { supabase } from './supabaseClient';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  canonical_url?: string;
  seo_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  category_id: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export async function getAllPublishedPosts(limit = 6, page = 1, category?: string, search?: string) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (category) query = query.eq('category_id', category);
  if (search) query = query.ilike('title', `%${search}%`);

  const { data, error } = await query;

  if (error) throw error;

  return data as BlogPost[];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;

  return data as BlogPost;
}

export async function getRecentPosts(limit = 4) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        title,
        excerpt,
        cover_image,
        created_at,
        author,
        category:blog_categories(name)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}
