// app/player/blog/edit/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { motion } from 'framer-motion';
import { 
  Save, Eye, X, Plus, 
  User, Tag, FolderOpen, Link as LinkIcon,
  ArrowLeft, Trash2
} from 'lucide-react';
import TiptapEditor from '@/components/editor/TiptapEditor';

interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
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
}

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    author_id: '',
    category_id: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    is_published: false
  });
  
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Données chargées
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  
  // États d'interface
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Chargement des données
  useEffect(() => {
    checkAuthAndLoadData();
  }, [slug]);

  const checkAuthAndLoadData = async () => {
    try {
      console.log('🔄 Vérification de l\'authentification...');

      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        console.error('❌ Erreur utilisateur:', userError);
        setError('Vous devez être connecté pour modifier un article');
        setIsLoadingPost(false);
        return;
      }

      setUser(currentUser);
      
      const isUserAdmin = currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      if (!isUserAdmin) {
        setError('Accès réservé à l\'administrateur');
        setIsLoadingPost(false);
        return;
      }

      setIsAdmin(true);
      await loadPostData();
      
    } catch (error) {
      console.error('❌ Erreur globale:', error);
      setError('Erreur lors du chargement des données');
      setIsLoadingPost(false);
    }
  };

  const loadPostData = async () => {
    try {
      console.log('📦 Chargement des données article...');
      
      // Charger l'article spécifique avec ses relations
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          authors(*),
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .eq('slug', slug)
        .single();

      if (postError) {
        console.error('❌ Erreur chargement article:', postError);
        setError('Article non trouvé');
        setIsLoadingPost(false);
        return;
      }

      if (post) {
        // Mettre à jour le formulaire avec les données de l'article
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          cover_image: post.cover_image || '',
          author_id: post.author_id || '',
          category_id: post.category_id?.toString() || '',
          seo_title: post.seo_title || '',
          seo_description: post.seo_description || '',
          seo_keywords: post.seo_keywords || '',
          is_published: post.is_published
        });

        // Mettre à jour les tags sélectionnés
        const postTags = post.blog_post_tags?.map((pt: any) => pt.blog_tags.id) || [];
        setSelectedTags(postTags);
      }

      // Charger les autres données
      await Promise.all([
        loadAuthors(),
        loadCategories(),
        loadTags()
      ]);

      console.log('✅ Données chargées avec succès');
      setIsLoadingPost(false);
      
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      setError('Erreur lors du chargement des données');
      setIsLoadingPost(false);
    }
  };

  const loadAuthors = async () => {
    try {
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select('*')
        .order('name');
      
      if (authorsError) throw authorsError;
      
      if (authorsData) {
        setAuthors(authorsData);
      }
    } catch (error) {
      console.error('Erreur chargement auteurs:', error);
    }
  };
  
  const loadCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      
      if (categoriesError) throw categoriesError;
      
      if (categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };
  
  const loadTags = async () => {
    try {
      const { data: tagsData, error: tagsError } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
      
      if (tagsError) throw tagsError;
      
      if (tagsData) {
        setTags(tagsData);
      }
    } catch (error) {
      console.error('Erreur chargement tags:', error);
    }
  };
  
  // Gestion des changements de formulaire
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };
  
  // Gestion du contenu Tiptap - CORRECTION ICI
  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    setError('');
  };
  
  // Gestion des tags
  const handleAddTag = (tagId: number) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags(prev => [...prev, tagId]);
    }
  };
  
  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };
  
  const handleCreateNewTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      const slug = newTag
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const { data: tag, error } = await supabase
        .from('blog_tags')
        .insert([{ name: newTag.trim(), slug }])
        .select()
        .single();
      
      if (error) throw error;
      
      if (tag) {
        setTags(prev => [...prev, tag]);
        handleAddTag(tag.id);
        setNewTag('');
      }
      
    } catch (error) {
      console.error('Erreur création tag:', error);
      setError('Erreur lors de la création du tag');
    }
  };
  
  // Validation du formulaire
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire');
      return false;
    }
    if (!formData.slug.trim()) {
      setError('Le slug est obligatoire');
      return false;
    }
    if (!formData.content.trim() || formData.content === '<p></p>') {
      setError('Le contenu est obligatoire');
      return false;
    }
    if (!formData.author_id) {
      setError('Veuillez sélectionner un auteur');
      return false;
    }
    if (!formData.category_id) {
      setError('Veuillez sélectionner une catégorie');
      return false;
    }
    
    // Validation du slug
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formData.slug)) {
      setError('Le slug ne doit contenir que des lettres minuscules, chiffres et tirets');
      return false;
    }
    
    return true;
  };
  
  // Mise à jour de l'article
  const handleSubmit = async (publish: boolean = false) => {
    setError('');
    
    if (!user) {
      setError('Vous devez être connecté pour modifier un article');
      return;
    }
    
    if (!isAdmin) {
      setError('Accès réservé à l\'administrateur');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Préparer les données pour Supabase
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content,
        cover_image: formData.cover_image.trim() || null,
        author_id: formData.author_id,
        category_id: parseInt(formData.category_id),
        seo_title: formData.seo_title.trim() || null,
        seo_description: formData.seo_description.trim() || null,
        seo_keywords: formData.seo_keywords.trim() || null,
        is_published: publish,
        published_at: publish ? new Date().toISOString() : formData.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      
      console.log('📝 Mise à jour de l\'article...');
      
      // Mise à jour de l'article
      const { error: postError } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('slug', slug);
      
      if (postError) {
        console.error('❌ Erreur Supabase:', postError);
        
        if (postError.code === '23505') {
          setError('Un article avec ce slug existe déjà');
        } else if (postError.code === '23503') {
          setError('L\'auteur ou la catégorie sélectionné n\'existe pas');
        } else {
          setError(`Erreur lors de la mise à jour: ${postError.message}`);
        }
        return;
      }
      
      // Mise à jour des tags
      // D'abord supprimer les anciennes associations
      const { error: deleteError } = await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', (await supabase.from('blog_posts').select('id').eq('slug', slug).single()).data?.id);
      
      if (deleteError) {
        console.error('Erreur suppression tags:', deleteError);
      }
      
      // Puis ajouter les nouvelles associations
      if (selectedTags.length > 0) {
        const postId = (await supabase.from('blog_posts').select('id').eq('slug', formData.slug).single()).data?.id;
        
        if (postId) {
          const postTags = selectedTags.map(tag_id => ({
            post_id: postId,
            tag_id
          }));
          
          const { error: tagsError } = await supabase
            .from('blog_post_tags')
            .insert(postTags);
          
          if (tagsError) {
            console.error('⚠️ Erreur tags:', tagsError);
          }
        }
      }
      
      alert(`✅ Article ${publish ? 'publié' : 'mis à jour'} avec succès !`);
      router.push('/player/blog');
      
    } catch (error) {
      console.error('❌ Erreur mise à jour article:', error);
      setError('Erreur inattendue lors de la mise à jour de l\'article');
    } finally {
      setIsLoading(false);
    }
  };

  // Suppression de l'article
  const handleDelete = async () => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('slug', slug);

      if (error) throw error;

      alert('🗑️ Article supprimé avec succès');
      router.push('/player/blog');
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      setError('Erreur lors de la suppression de l\'article');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Rendu du preview
  const renderPreview = () => (
    <div className="bg-white rounded-lg border p-6">
      <h1 className="text-3xl font-bold mb-4">{formData.title || 'Titre de l\'article'}</h1>
      
      {formData.cover_image && (
        <img 
          src={formData.cover_image} 
          alt="Cover" 
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      
      {formData.excerpt && (
        <p className="text-gray-600 text-lg mb-6 italic">{formData.excerpt}</p>
      )}
      
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: formData.content || '<p>Le contenu de l\'article apparaîtra ici...</p>' }}
      />
    </div>
  );

  // Écran de chargement
  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
            <p className="text-gray-600">Chargement de l'article</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/player/blog')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} />
              Retour aux articles
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'article</h1>
          <p className="text-gray-600 mt-2">Modifiez les informations de votre article</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
            <span>Mode Administrateur - {user?.email}</span>
          </div>
        </motion.div>

        {/* Message d'erreur */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte informations de base */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Contenu de l'article
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Titre */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre de votre article..."
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="url-de-l-article"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ceci formera l'URL de votre article: /blog/{formData.slug}
                  </p>
                </div>
                
                {/* Extrait */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Extrait
                  </label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brève description de l'article..."
                  />
                </div>
                
                {/* Image de couverture - URL */}
                <div>
                  <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">
                    Image de couverture (URL)
                  </label>
                  
                  {formData.cover_image ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <img 
                          src={formData.cover_image} 
                          alt="Aperçu de l'image de couverture" 
                          className="w-64 h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <button
                          onClick={() => handleInputChange('cover_image', '')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          title="Supprimer l'image"
                          aria-label="Supprimer l'image de couverture"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <LinkIcon className="w-4 h-4" />
                        <span>Image chargée avec succès</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <input
                          id="cover_image"
                          type="url"
                          value={formData.cover_image}
                          onChange={(e) => handleInputChange('cover_image', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Collez l'URL complète de l'image (ex: https://votredomaine.com/images/cover.jpg)
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Contenu avec Tiptap - CORRECTION ICI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu *
                  </label>
                  <TiptapEditor
                    content={formData.content}
                    onChange={handleContentChange}
                    placeholder="Commencez à rédiger votre article..."
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Carte SEO */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Optimisation SEO</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    id="seo_title"
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre pour les moteurs de recherche..."
                  />
                </div>
                
                <div>
                  <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description pour les moteurs de recherche..."
                  />
                </div>
                
                <div>
                  <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Mots-clés
                  </label>
                  <input
                    id="seo_keywords"
                    type="text"
                    value={formData.seo_keywords}
                    onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="mot-clé1, mot-clé2, mot-clé3..."
                  />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Carte publication */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Publication</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4" />
                    {isLoading ? 'Publication...' : 'Publier'}
                  </button>
                </div>
                
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Eye className="w-4 h-4" />
                  {isPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer l'article
                </button>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => handleInputChange('is_published', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_published" className="text-sm text-gray-700">
                    Marquer comme publié
                  </label>
                </div>
              </div>
            </motion.div>
            
            {/* Carte auteur et catégorie */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Organisation
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Auteur */}
                <div>
                  <label htmlFor="author_select" className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur *
                  </label>
                  <select
                    id="author_select"
                    value={formData.author_id}
                    onChange={(e) => handleInputChange('author_id', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un auteur</option>
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Catégorie */}
                <div>
                  <label htmlFor="category_select" className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    id="category_select"
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
            
            {/* Carte tags */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Tags sélectionnés */}
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <span 
                        key={tagId}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag.name}
                        <button
                          onClick={() => handleRemoveTag(tagId)}
                          className="hover:text-blue-900 transition"
                          type="button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
                
                {/* Sélection de tags existants */}
                <div>
                  <label htmlFor="existing_tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags existants
                  </label>
                  <select
                    id="existing_tags"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTag(Number(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Ajouter un tag existant</option>
                    {tags
                      .filter(tag => !selectedTags.includes(tag.id))
                      .map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                {/* Création de nouveau tag */}
                <div>
                  <label htmlFor="new_tag" className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau tag
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="new_tag"
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateNewTag()}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du nouveau tag"
                    />
                    <button
                      onClick={handleCreateNewTag}
                      disabled={!newTag.trim() || isLoading}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Aperçu */}
        {isPreview && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Aperçu</h2>
              </div>
              <div className="p-6">
                {renderPreview()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}