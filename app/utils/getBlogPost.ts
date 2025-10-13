import { createClient } from "@supabase/supabase-js";


// --- Types basés sur votre structure Supabase exacte
export interface BlogPost {
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Récupère un article de blog par son slug, avec auteur, catégorie et tags.
 * @param slug Slug de l'article
 * @returns BlogPost ou null
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Article principal avec relations
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

    if (postError || !post) {
      return null;
    }

    // Tags via table de liaison
    const { data: tagsData, error: tagsError } = await supabase
      .from("blog_post_tags")
      .select(`blog_tags(id, slug, name)`)
      .eq("post_id", post.id);

    // Aplatir les tags
    const tags = (tagsData ?? []).flatMap((item: any) => (item.blog_tags ?? []))
      .filter(
        (tag): tag is { id: number; slug: string; name: string } =>
          !!tag && typeof tag === 'object' && 'id' in tag && 'slug' in tag && 'name' in tag
      );

    // Structure finale
    return {
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
  } catch (error) {
    return null;
  }
}
