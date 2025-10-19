'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Tag,
  BookOpen,
  X,
  Save,
  FileText,
  Hash,
  Edit3,
  MoreVertical,
  BarChart3,
  FolderOpen,
  MessageSquare,
} from 'lucide-react';

interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: string;
  social_links?: any;
  created_at: string;
}

interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

interface BlogTag {
  id: number;
  slug: string;
  name: string;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  published_at?: string;
  updated_at: string;
  author_id?: string;
  category_id?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  views: number;
  is_published: boolean;
  authors?: Author;
  blog_categories?: Category;
  tags?: BlogTag[];
  blog_post_tags?: any[];
}

interface AdminStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_authors: number;
  total_categories: number;
  total_tags: number;
}

export default function BlogListPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTag, setFilterTag] = useState('');
  
  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showAuthorList, setShowAuthorList] = useState(false);
  const [showTagList, setShowTagList] = useState(false);
  
  // Form states
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    slug: '', 
    description: '',
    seo_title: '',
    seo_description: '' 
  });
  const [newAuthor, setNewAuthor] = useState({ 
    name: '', 
    bio: '', 
    role: 'writer',
    social_links: {} 
  });
  const [newTag, setNewTag] = useState({ name: '', slug: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);

 
  // 🔹 Charger toutes les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger les statistiques depuis la vue
        const { data: statsData, error: statsError } = await supabase
          .from('blog_admin_stats')
          .select('*')
          .single();

        if (!statsError && statsData) {
          setStats(statsData);
        }

        // Charger les catégories
        const { data: cats, error: catsError } = await supabase
          .from('blog_categories')
          .select('*')
          .order('name');

        if (catsError) console.error('Erreur catégories:', catsError);

        // Charger les auteurs
        const { data: auths, error: authsError } = await supabase
          .from('authors')
          .select('*')
          .order('name');

        if (authsError) console.error('Erreur auteurs:', authsError);

        // Charger les tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('blog_tags')
          .select('*')
          .order('name');

        if (tagsError) console.error('Erreur tags:', tagsError);

        // Charger les articles avec toutes les relations via la vue published_blog_posts
        const { data: postsData, error: postsError } = await supabase
          .from('published_blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (postsError) {
          console.error('Erreur avec la vue, chargement direct:', postsError);
          // Fallback: charger directement depuis la table
          const { data: postsFallback, error: fallbackError } = await supabase
            .from('blog_posts')
            .select(`
              *,
              authors(*),
              blog_categories(*),
              blog_post_tags(
                blog_tags(*)
              )
            `)
            .order('updated_at', { ascending: false });

          if (!fallbackError && postsFallback) {
            const postsWithTags = postsFallback.map(post => ({
              ...post,
              tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags) || []
            }));
            setPosts(postsWithTags);
          }
        } else if (postsData) {
          // Transformer les données de la vue
          const transformedPosts = postsData.map(post => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: post.cover_image,
            published_at: post.published_at,
            updated_at: post.updated_at,
            author_id: post.author_id,
            category_id: post.category_id,
            seo_title: post.seo_title,
            seo_description: post.seo_description,
            seo_keywords: post.seo_keywords,
            views: post.views,
            is_published: post.is_published,
            authors: {
              id: post.author_id,
              name: post.author_name,
              bio: post.author_bio,
              avatar: post.author_avatar,
              social_links: post.author_social_links,
              role: 'writer',
              created_at: ''
            },
            blog_categories: {
              id: post.category_id,
              name: post.category_name,
              slug: post.category_slug,
              description: post.category_description,
              created_at: ''
            },
            tags: post.tags ? post.tags.map((tagName: string, index: number) => ({
              id: index,
              name: tagName,
              slug: post.tag_slugs?.[index] || tagName.toLowerCase()
            })) : []
          }));
          setPosts(transformedPosts);
        }

        setCategories(cats || []);
        setAuthors(auths || []);
        setTags(tagsData || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [supabase]);

  // 🔎 Filtrage dynamique
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.content || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesCat =
      !filterCat || (p.blog_categories && p.blog_categories.name === filterCat);
    
    const matchesAuthor =
      !filterAuthor || (p.authors && p.authors.name === filterAuthor);
    
    const matchesStatus =
      !filterStatus || 
      (filterStatus === 'published' && p.is_published) ||
      (filterStatus === 'draft' && !p.is_published);
    
    const matchesTag =
      !filterTag || 
      (p.tags && p.tags.some(tag => tag.name === filterTag));

    return matchesSearch && matchesCat && matchesAuthor && matchesStatus && matchesTag;
  });

  // 🆕 Gestion des catégories
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Veuillez entrer un nom de catégorie');
      return;
    }

    try {
      const slug = newCategory.slug.trim() || newCategory.name.toLowerCase().replace(/\s+/g, '-');
      
      const { data, error } = await supabase
        .from('blog_categories')
        .insert([{ 
          name: newCategory.name.trim(),
          slug: slug,
          description: newCategory.description.trim(),
          seo_title: newCategory.seo_title.trim(),
          seo_description: newCategory.seo_description.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      setNewCategory({ name: '', slug: '', description: '', seo_title: '', seo_description: '' });
      setShowCategoryModal(false);
      alert('✅ Catégorie ajoutée avec succès');
    } catch (error: any) {
      console.error('Erreur ajout catégorie:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // ✏️ Modifier une catégorie
  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      alert('Veuillez entrer un nom de catégorie');
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_categories')
        .update({ 
          name: editingCategory.name.trim(),
          slug: editingCategory.slug.trim(),
          description: editingCategory.description,
          seo_title: editingCategory.seo_title,
          seo_description: editingCategory.seo_description
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
      alert('✅ Catégorie modifiée avec succès');
    } catch (error: any) {
      console.error('Erreur modification catégorie:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 👤 Gestion des auteurs
  const handleAddAuthor = async () => {
    if (!newAuthor.name.trim()) {
      alert('Veuillez entrer un nom d\'auteur');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('authors')
        .insert([{ 
          name: newAuthor.name.trim(), 
          bio: newAuthor.bio.trim(),
          role: newAuthor.role,
          social_links: newAuthor.social_links
        }])
        .select()
        .single();

      if (error) throw error;

      setAuthors(prev => [...prev, data]);
      setNewAuthor({ name: '', bio: '', role: 'writer', social_links: {} });
      setShowAuthorModal(false);
      alert('✅ Auteur ajouté avec succès');
    } catch (error: any) {
      console.error('Erreur ajout auteur:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // ✏️ Modifier un auteur
  const handleEditAuthor = async () => {
    if (!editingAuthor || !editingAuthor.name.trim()) {
      alert('Veuillez entrer un nom d\'auteur');
      return;
    }

    try {
      const { error } = await supabase
        .from('authors')
        .update({ 
          name: editingAuthor.name.trim(),
          bio: editingAuthor.bio,
          role: editingAuthor.role,
          social_links: editingAuthor.social_links
        })
        .eq('id', editingAuthor.id);

      if (error) throw error;

      setAuthors(prev => prev.map(author => 
        author.id === editingAuthor.id ? editingAuthor : author
      ));
      setEditingAuthor(null);
      alert('✅ Auteur modifié avec succès');
    } catch (error: any) {
      console.error('Erreur modification auteur:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 🏷️ Gestion des tags
  const handleAddTag = async () => {
    if (!newTag.name.trim()) {
      alert('Veuillez entrer un nom de tag');
      return;
    }

    try {
      const slug = newTag.slug.trim() || newTag.name.toLowerCase().replace(/\s+/g, '-');
      
      const { data, error } = await supabase
        .from('blog_tags')
        .insert([{ 
          name: newTag.name.trim(),
          slug: slug
        }])
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      setNewTag({ name: '', slug: '' });
      setShowTagModal(false);
      alert('✅ Tag ajouté avec succès');
    } catch (error: any) {
      console.error('Erreur ajout tag:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // ✏️ Modifier un tag
  const handleEditTag = async () => {
    if (!editingTag || !editingTag.name.trim()) {
      alert('Veuillez entrer un nom de tag');
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_tags')
        .update({ 
          name: editingTag.name.trim(),
          slug: editingTag.slug.trim()
        })
        .eq('id', editingTag.id);

      if (error) throw error;

      setTags(prev => prev.map(tag => 
        tag.id === editingTag.id ? editingTag : tag
      ));
      setEditingTag(null);
      alert('✅ Tag modifié avec succès');
    } catch (error: any) {
      console.error('Erreur modification tag:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 🗑️ Supprimer une catégorie
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('⚠️ Supprimer cette catégorie ? Les articles associés seront décategorisés.')) return;

    try {
      const { error } = await supabase.from('blog_categories').delete().eq('id', id);
      if (error) throw error;

      setCategories(prev => prev.filter(cat => cat.id !== id));
      alert('🗑️ Catégorie supprimée');
    } catch (error: any) {
      console.error('Erreur suppression catégorie:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 🗑️ Supprimer un auteur
  const handleDeleteAuthor = async (id: string) => {
    if (!confirm('⚠️ Supprimer cet auteur ? Les articles associés seront sans auteur.')) return;

    try {
      const { error } = await supabase.from('authors').delete().eq('id', id);
      if (error) throw error;

      setAuthors(prev => prev.filter(author => author.id !== id));
      alert('🗑️ Auteur supprimé');
    } catch (error: any) {
      console.error('Erreur suppression auteur:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 🗑️ Supprimer un tag
  const handleDeleteTag = async (id: number) => {
    if (!confirm('⚠️ Supprimer ce tag ?')) return;

    try {
      const { error } = await supabase.from('blog_tags').delete().eq('id', id);
      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== id));
      alert('🗑️ Tag supprimé');
    } catch (error: any) {
      console.error('Erreur suppression tag:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 🗑️ Supprimer un article
  const handleDeletePost = async (id: number) => {
    if (!confirm('⚠️ Supprimer définitivement cet article ?')) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;

      setPosts((prev) => prev.filter((p) => p.id !== id));
      alert('🗑️ Article supprimé.');
    } catch (err: any) {
      console.error('Erreur suppression article:', err);
      alert(`Erreur : ${err.message}`);
    }
  };

  // 📊 Publier/Dépublier un article
  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: !post.is_published,
          published_at: !post.is_published ? new Date().toISOString() : post.published_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      setPosts(prev => prev.map(p => 
        p.id === post.id ? { 
          ...p, 
          is_published: !p.is_published,
          published_at: !p.is_published ? new Date().toISOString() : p.published_at,
          updated_at: new Date().toISOString()
        } : p
      ));
      
      alert(`✅ Article ${!post.is_published ? 'publié' : 'retiré'} avec succès`);
    } catch (error: any) {
      console.error('Erreur publication:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 🔄 Recharger les statistiques
  const refreshStats = async () => {
    try {
      const { data: statsData, error: statsError } = await supabase
        .from('blog_admin_stats')
        .select('*')
        .single();

      if (!statsError && statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erreur rafraîchissement stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F23E8] mx-auto mb-4"></div>
          Chargement des données...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-[#0F23E8]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Gestion du Blog
        </motion.h1>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            <BarChart3 size={16} /> Statistiques
          </button>
          <button
            onClick={() => setShowCategoryList(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            <FolderOpen size={16} /> Catégories
          </button>
          <button
            onClick={() => setShowAuthorList(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            <Users size={16} /> Auteurs
          </button>
          <button
            onClick={() => setShowTagList(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            <Hash size={16} /> Tags
          </button>
          <button
            onClick={() => router.push('/player/blog/new')}
            className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            <Plus size={16} /> Nouvel Article
          </button>
        </div>
      </div>

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Articles</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_posts || posts.length}</p>
              <p className="text-sm text-gray-500">
                {stats?.published_posts || posts.filter(p => p.is_published).length} publiés
              </p>
            </div>
            <BookOpen className="text-[#0F23E8]" size={32} />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Vues Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_views || posts.reduce((sum, p) => sum + (p.views || 0), 0)}</p>
              <p className="text-sm text-gray-500">Vues cumulées</p>
            </div>
            <Eye className="text-[#0F23E8]" size={32} />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Auteurs</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_authors || authors.length}</p>
            </div>
            <Users className="text-[#0F23E8]" size={32} />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Catégories & Tags</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_categories || categories.length}C / {stats?.total_tags || tags.length}T
              </p>
            </div>
            <Tag className="text-[#0F23E8]" size={32} />
          </div>
        </motion.div>
      </div>

      {/* FILTRES AVANCÉS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            aria-label="Filtrer par catégorie"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-400" />
          <select
            aria-label="Filtrer par auteur"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
          >
            <option value="">Tous les auteurs</option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Hash size={18} className="text-gray-400" />
          <select
            aria-label="Filtrer par tag"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
          >
            <option value="">Tous les tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FileText size={18} className="text-gray-400" />
          <select
            aria-label="Filtrer par statut"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </div>

      {/* LISTE DES ARTICLES */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 italic">Aucun article trouvé.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
          <table className="min-w-full rounded-xl text-sm">
            <thead className="bg-[#0F23E8] text-white text-left">
              <tr>
                <th className="p-4 font-semibold">Titre</th>
                <th className="p-4 font-semibold">Catégorie</th>
                <th className="p-4 font-semibold">Auteur</th>
                <th className="p-4 font-semibold">Tags</th>
                <th className="p-4 font-semibold">Vues</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Modifié le</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{p.title}</div>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-1">
                      {p.excerpt || '—'}
                    </p>
                  </td>
                  <td className="p-4 text-gray-700">
                    {p.blog_categories?.name || '—'}
                  </td>
                  <td className="p-4 text-gray-700">
                    {p.authors?.name || '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.slice(0, 2).map(tag => (
                        <span key={tag.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag.name}
                        </span>
                      ))}
                      {p.tags && p.tags.length > 2 && (
                        <span className="text-gray-500 text-xs">+{p.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 flex items-center gap-1">
                    <Eye size={14} className="text-gray-400" /> {p.views || 0}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`flex items-center gap-1 font-medium ${
                        p.is_published 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-500 hover:text-gray-700'
                      } transition-colors`}
                    >
                      {p.is_published ? (
                        <><CheckCircle2 size={14} /> Publié</>
                      ) : (
                        <><XCircle size={14} /> Brouillon</>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-gray-600 flex items-center gap-1">
                    <Clock size={14} />{' '}
                    {new Date(p.updated_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => router.push(`/player/blog/edit/${p.slug}`)}
                      className="text-[#0F23E8] hover:text-[#0A1ACF] transition p-2 rounded-lg hover:bg-blue-50"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(p.id)}
                      className="text-red-500 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL STATISTIQUES DÉTAILLÉES */}
      <AnimatePresence>
        {showStatsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Statistiques du Blog</h3>
                <button 
                  onClick={() => setShowStatsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Fermer le modal statistiques"
                  title="Fermer"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Articles</h4>
                  <p className="text-3xl font-bold text-blue-600">{stats?.total_posts || 0}</p>
                  <p className="text-sm text-blue-700">
                    {stats?.published_posts || 0} publiés • {stats?.draft_posts || 0} brouillons
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Vues Total</h4>
                  <p className="text-3xl font-bold text-green-600">{stats?.total_views || 0}</p>
                  <p className="text-sm text-green-700">Vues cumulées</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Contenu</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats?.total_categories || 0} catégories
                  </p>
                  <p className="text-sm text-purple-700">
                    {stats?.total_tags || 0} tags
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Équipe</h4>
                  <p className="text-3xl font-bold text-orange-600">{stats?.total_authors || 0}</p>
                  <p className="text-sm text-orange-700">Auteurs actifs</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={refreshStats}
                  className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <BarChart3 size={16} /> Actualiser
                </button>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL GESTION CATÉGORIES */}
      <AnimatePresence>
        {showCategoryList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Gestion des Catégories ({categories.length})</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowCategoryModal(true)}
                    className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg transition-all duration-300"
                    aria-label="Ajouter une nouvelle catégorie"
                  >
                    <Plus size={16} aria-hidden="true" /> Nouvelle
                  </button>
                  <button 
                    onClick={() => setShowCategoryList(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Fermer la liste des catégories"
                    title="Fermer"
                  >
                    <X size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="text-blue-600 hover:text-blue-800 transition p-2"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 transition p-2"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL GESTION AUTEURS */}
      <AnimatePresence>
        {showAuthorList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Gestion des Auteurs ({authors.length})</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAuthorModal(true)}
                    className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg transition-all duration-300"
                    aria-label="Ajouter un nouvel auteur"
                  >
                    <Plus size={16} aria-hidden="true" /> Nouveau
                  </button>
                  <button 
                    onClick={() => setShowAuthorList(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Fermer la liste des auteurs"
                    title="Fermer"
                  >
                    <X size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {authors.map((author) => (
                  <div key={author.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{author.name}</h4>
                      <p className="text-sm text-gray-600">Rôle: {author.role}</p>
                      {author.bio && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{author.bio}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingAuthor(author)}
                        className="text-blue-600 hover:text-blue-800 transition p-2"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAuthor(author.id)}
                        className="text-red-600 hover:text-red-800 transition p-2"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL GESTION TAGS */}
      <AnimatePresence>
        {showTagList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Gestion des Tags ({tags.length})</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTagModal(true)}
                    className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg transition-all duration-300"
                    aria-label="Ajouter un nouveau tag"
                  >
                    <Plus size={16} aria-hidden="true" /> Nouveau
                  </button>
                  <button 
                    onClick={() => setShowTagList(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Fermer la liste des tags"
                    title="Fermer"
                  >
                    <X size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{tag.name}</h4>
                      <p className="text-sm text-gray-600">Slug: {tag.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTag(tag)}
                        className="text-blue-600 hover:text-blue-800 transition p-2"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-600 hover:text-red-800 transition p-2"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL AJOUT/EDIT CATEGORIE */}
      <AnimatePresence>
        {(showCategoryModal || editingCategory) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
                </h3>
                <button 
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom de la catégorie *"
                  value={editingCategory ? editingCategory.name : newCategory.name}
                  onChange={(e) => editingCategory 
                    ? setEditingCategory({...editingCategory, name: e.target.value})
                    : setNewCategory(prev => ({...prev, name: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="Slug (auto-généré si vide)"
                  value={editingCategory ? editingCategory.slug : newCategory.slug}
                  onChange={(e) => editingCategory
                    ? setEditingCategory({...editingCategory, slug: e.target.value})
                    : setNewCategory(prev => ({...prev, slug: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
                />
                <textarea
                  placeholder="Description"
                  value={editingCategory ? editingCategory.description || '' : newCategory.description}
                  onChange={(e) => editingCategory
                    ? setEditingCategory({...editingCategory, description: e.target.value})
                    : setNewCategory(prev => ({...prev, description: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300 resize-none"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Titre SEO"
                  value={editingCategory ? editingCategory.seo_title || '' : newCategory.seo_title}
                  onChange={(e) => editingCategory
                    ? setEditingCategory({...editingCategory, seo_title: e.target.value})
                    : setNewCategory(prev => ({...prev, seo_title: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
                />
                <textarea
                  placeholder="Description SEO"
                  value={editingCategory ? editingCategory.seo_description || '' : newCategory.seo_description}
                  onChange={(e) => editingCategory
                    ? setEditingCategory({...editingCategory, seo_description: e.target.value})
                    : setNewCategory(prev => ({...prev, seo_description: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300 resize-none"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={editingCategory ? handleEditCategory : handleAddCategory}
                  className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <Save size={16} /> {editingCategory ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL AJOUT/EDIT AUTEUR */}
      <AnimatePresence>
        {(showAuthorModal || editingAuthor) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAuthor ? 'Modifier Auteur' : 'Nouvel Auteur'}
                </h3>
                <button 
                  onClick={() => {
                    setShowAuthorModal(false);
                    setEditingAuthor(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom de l'auteur *"
                  value={editingAuthor ? editingAuthor.name : newAuthor.name}
                  onChange={(e) => editingAuthor 
                    ? setEditingAuthor({...editingAuthor, name: e.target.value})
                    : setNewAuthor(prev => ({...prev, name: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
                />
                <select
                  value={editingAuthor ? editingAuthor.role : newAuthor.role}
                  onChange={(e) => editingAuthor
                    ? setEditingAuthor({...editingAuthor, role: e.target.value})
                    : setNewAuthor(prev => ({...prev, role: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
                >
                  <option value="writer">Rédacteur</option>
                  <option value="editor">Éditeur</option>
                  <option value="admin">Administrateur</option>
                </select>
                <textarea
                  placeholder="Biographie"
                  value={editingAuthor ? editingAuthor.bio || '' : newAuthor.bio}
                  onChange={(e) => editingAuthor
                    ? setEditingAuthor({...editingAuthor, bio: e.target.value})
                    : setNewAuthor(prev => ({...prev, bio: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAuthorModal(false);
                    setEditingAuthor(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={editingAuthor ? handleEditAuthor : handleAddAuthor}
                  className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <Save size={16} /> {editingAuthor ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL AJOUT/EDIT TAG */}
      <AnimatePresence>
        {(showTagModal || editingTag) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTag ? 'Modifier le Tag' : 'Nouveau Tag'}
                </h3>
                <button 
                  onClick={() => {
                    setShowTagModal(false);
                    setEditingTag(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom du tag *"
                  value={editingTag ? editingTag.name : newTag.name}
                  onChange={(e) => editingTag 
                    ? setEditingTag({...editingTag, name: e.target.value})
                    : setNewTag(prev => ({...prev, name: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="Slug (auto-généré si vide)"
                  value={editingTag ? editingTag.slug : newTag.slug}
                  onChange={(e) => editingTag
                    ? setEditingTag({...editingTag, slug: e.target.value})
                    : setNewTag(prev => ({...prev, slug: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0F23E8] focus:border-[#0F23E8] transition-all duration-300"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowTagModal(false);
                    setEditingTag(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={editingTag ? handleEditTag : handleAddTag}
                  className="flex items-center gap-2 bg-[#0F23E8] hover:bg-[#0A1ACF] text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <Save size={16} /> {editingTag ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}