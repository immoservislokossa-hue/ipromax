'use client';

import { useState, useEffect, useCallback } from 'react';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  views?: number;
  author?: string;
  authorImage?: string;
  authorRole?: string;
  tags?: string[];
}

interface ApiResponse {
  articles: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  error?: string;
}

interface UseBlogPostsResult {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  currentPage: number;
  searchTerm: string;
  category: string;
  loadMore: () => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  refetch: () => void;
  reset: () => void;
}

export function useBlogPosts(initialSearch: string = '', initialCategory: string = ''): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const fetchBlogs = useCallback(async (currentPage: number = 1, reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('limit', '10'); // Réduit à 10 pour mieux s'adapter au layout
      params.append('page', currentPage.toString());
      params.append('sort', 'newest'); // Tri par plus récent
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const response = await fetch(`/api/blog?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (reset || currentPage === 1) {
        setPosts(data.articles);
      } else {
        setPosts(prev => [...prev, ...data.articles]);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
      
    } catch (err) {
      console.error('❌ Erreur fetchBlogs:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      if (reset) {
        setPosts([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, category]);

  // Chargement initial et quand les filtres changent
  useEffect(() => {
    setPage(1);
    fetchBlogs(1, true);
  }, [fetchBlogs]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBlogs(nextPage, false);
    }
  }, [hasMore, isLoading, page, fetchBlogs]);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  const handleSetCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const refetch = useCallback(() => {
    fetchBlogs(page, true);
  }, [fetchBlogs, page]);

  const reset = useCallback(() => {
    setSearch('');
    setCategory('');
    setPage(1);
  }, []);

  return { 
    posts, 
    isLoading, 
    error, 
    total, 
    hasMore,
    currentPage: page,
    searchTerm: search,
    category,
    loadMore, 
    setSearch: handleSetSearch,
    setCategory: handleSetCategory,
    refetch,
    reset
  };
}