interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  author: string;
  category: string;
  metaDescription: string;
  tags: string[];
  readingTime: string;
  createdAt: string;
  updatedAt: string;
  isMock?: boolean;
}

export function useBlog() {
  const fetchBlogs = async ({ isMock = false } = {}) => {
    try {
      const url = isMock ? '/api/blog?isMock=true' : '/api/blog';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erreur lors de la récupération des articles');
      return await response.json();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  };

  const fetchBlogBySlug = async (slug: string, { isMock = false } = {}) => {
    try {
      const url = isMock ? `/api/blog/${slug}?isMock=true` : `/api/blog/${slug}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Article non trouvé');
      return await response.json();
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  };

  const createBlog = async (data: Partial<Blog>) => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      return await response.json();
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  };

  const updateBlog = async (slug: string, data: Partial<Blog>, { isMock = false } = {}) => {
    try {
      const url = isMock ? `/api/blog/${slug}?isMock=true` : `/api/blog/${slug}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, isMock }),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      return await response.json();
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  };

  const deleteBlog = async (slug: string, { isMock = false } = {}) => {
    try {
      const url = isMock ? `/api/blog/${slug}?isMock=true` : `/api/blog/${slug}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  };

  return {
    fetchBlogs,
    fetchBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
