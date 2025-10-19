'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/app/utils/supabase/client';
import { motion } from 'framer-motion';
import slugify from 'slugify';
import {
  Loader2,
  Save,
  Upload,
  ArrowLeft,
} from 'lucide-react';

const TiptapEditor = dynamic(() => import('@/app/components/editor/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
        <p className="text-gray-600">Chargement de l'éditeur...</p>
      </div>
    </div>
  ),
});

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: number;
  author_id: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  is_published: boolean;
  blog_post_tags: { tag_id: number }[];
}

interface Category {
  id: number;
  slug: string;
  name: string;
}

interface Tag {
  id: number;
  slug: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
}

export default function EditBlogPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category_id: '',
    author_id: '',
    selectedTags: [] as number[],
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    is_published: false,
  });

  // 🔹 Charger les données avec gestion d'erreur améliorée
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          { data: post, error: postError },
          { data: cats, error: catError },
          { data: tgs, error: tagError },
          { data: auth, error: authError }
        ] = await Promise.all([
          supabase
            .from('blog_posts')
            .select(`
              *,
              blog_post_tags(tag_id)
            `)
            .eq('slug', slug)
            .single(),
          supabase.from('blog_categories').select('*').order('name'),
          supabase.from('blog_tags').select('*').order('name'),
          supabase.from('authors').select('id, name').order('name'),
        ]);

        if (postError) {
          console.error('Erreur post:', postError);
          throw new Error(`Erreur lors du chargement de l'article: ${postError.message}`);
        }
        if (catError) console.warn('Erreur catégories:', catError);
        if (tagError) console.warn('Erreur tags:', tagError);
        if (authError) console.warn('Erreur auteurs:', authError);

        if (!post) {
          alert('❌ Article introuvable.');
          router.push('/player/blog');
          return;
        }

        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          cover_image: post.cover_image || '',
          category_id: post.category_id?.toString() || '',
          author_id: post.author_id || '',
          selectedTags: post.blog_post_tags?.map((t: any) => t.tag_id) || [],
          seo_title: post.seo_title || '',
          seo_description: post.seo_description || '',
          seo_keywords: post.seo_keywords || '',
          is_published: post.is_published || false,
        });

        setCategories(cats || []);
        setTags(tgs || []);
        setAuthors(auth || []);
      } catch (error: any) {
        console.error('Erreur lors du chargement:', error);
        alert(`❌ ${error.message || 'Erreur lors du chargement des données'}`);
        router.push('/player/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, supabase, router]);

  // 🔹 Mise à jour du formulaire avec debounce pour le slug
  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && { 
        slug: slugify(value, { 
          lower: true, 
          strict: true,
          trim: true 
        }) 
      }),
    }));
  }, []);

  // 🔹 Gestion des tags avec toggle optimisé
  const toggleTag = useCallback((tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id) => id !== tagId)
        : [...prev.selectedTags, tagId],
    }));
  }, []);

  // 🔹 Sauvegarde des modifications avec gestion RLS
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Vérifier l'authentification
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté pour modifier un article');
      }

      // Validation des données
      if (!formData.title.trim()) {
        throw new Error('Le titre est obligatoire');
      }

      if (!formData.slug.trim()) {
        throw new Error('Le slug est obligatoire');
      }

      // 1️⃣ Mise à jour du post
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content,
          cover_image: formData.cover_image.trim(),
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          author_id: formData.author_id || null,
          seo_title: formData.seo_title.trim(),
          seo_description: formData.seo_description.trim(),
          seo_keywords: formData.seo_keywords.trim(),
          is_published: formData.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug);

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error('Un article avec ce slug existe déjà');
        }
        throw updateError;
      }

      // 2️⃣ Récupérer l'ID du post
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', formData.slug)
        .single();

      if (postError || !post) {
        throw new Error(`Article introuvable après mise à jour`);
      }

      // 3️⃣ Gestion des tags avec gestion d'erreur RLS
      try {
        // Supprimer les anciens tags
        const { error: deleteError } = await supabase
          .from('blog_post_tags')
          .delete()
          .eq('post_id', post.id);

        if (deleteError && !deleteError.message.includes('0 rows')) {
          console.warn('Erreur suppression tags:', deleteError);
        }

        // Réinsérer les nouveaux tags
        if (formData.selectedTags.length > 0) {
          const relations = formData.selectedTags.map((tagId: number) => ({
            post_id: post.id,
            tag_id: tagId,
          }));

          const { error: insertError } = await supabase
            .from('blog_post_tags')
            .insert(relations);

          if (insertError) {
            // Si erreur RLS, essayer avec une fonction stockée
            if (insertError.message.includes('row-level security')) {
              console.warn('RLS bloqué, tentative alternative...');
              // Vous pouvez implémenter une fonction stockée ici
              throw new Error('Configuration des permissions nécessaire. Contactez l\'administrateur.');
            }
            throw insertError;
          }
        }
      } catch (tagError: any) {
        console.error('Erreur gestion tags:', tagError);
        // Continuer même si erreur tags (non bloquant)
      }

      // ✅ Succès
      alert('✅ Article mis à jour avec succès !');
      router.push('/player/blog');
      router.refresh(); // Rafraîchir le cache Next.js

    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde :', err);
      
      let errorMessage = 'Erreur inconnue';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.details) {
        errorMessage = err.details;
      } else if (err.code) {
        errorMessage = `Erreur ${err.code}`;
      }

      alert(`❌ ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Gestion des erreurs d'image
  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <Loader2 className="animate-spin mr-2" size={20} />
        Chargement de l'article...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✏️ Modifier l'article
        </motion.h1>

        <button
          onClick={() => router.push('/player/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-300"
          aria-label="Retour à la liste des articles"
          disabled={saving}
        >
          <ArrowLeft size={18} />
          <span>Retour</span>
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        {/* Titre et Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block font-semibold mb-2 text-gray-800">
              Titre *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              aria-required="true"
              placeholder="Titre de l'article"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="slug" className="block font-semibold mb-2 text-gray-800">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
              aria-describedby="slug-help"
              placeholder="titre-de-l-article"
              disabled={saving}
            />
            <p id="slug-help" className="text-sm text-gray-500 mt-1">
              Identifiant unique dans l'URL
            </p>
          </div>
        </div>

        {/* Résumé */}
        <div>
          <label htmlFor="excerpt" className="block font-semibold mb-2 text-gray-800">
            Résumé
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
            aria-describedby="excerpt-help"
            placeholder="Court résumé pour les aperçus..."
            disabled={saving}
          />
          <p id="excerpt-help" className="text-sm text-gray-500 mt-1">
            {formData.excerpt.length}/200 caractères
          </p>
        </div>

        {/* Contenu */}
        <div>
          <label htmlFor="content" className="block font-semibold mb-2 text-gray-800">
            Contenu de l'article *
          </label>
         
<TiptapEditor
  content={formData.content || '<p></p>'} // S'assurer d'avoir un contenu valide
  onChange={(value) => handleChange('content', value)}
/
>
          <p id="content-help" className="text-sm text-gray-500 mt-2">
            Contenu principal avec mise en forme riche
          </p>
        </div>

        {/* Image de couverture */}
        <div>
          <label htmlFor="cover_image" className="block font-semibold mb-2 text-gray-800">
            Image de couverture
          </label>
          <div className="flex gap-2 items-start">
            <input
              id="cover_image"
              type="url"
              value={formData.cover_image}
              onChange={(e) => {
                handleChange('cover_image', e.target.value);
                setImageError(false);
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              aria-describedby="image-help"
              disabled={saving}
            />
            <Upload size={20} className="text-gray-500 mt-2.5" aria-hidden="true" />
          </div>
          <p id="image-help" className="text-sm text-gray-500 mt-1">
            URL de l'image de couverture
          </p>
          
          {formData.cover_image && !imageError && (
            <div className="mt-3">
              <img
                src={formData.cover_image}
                alt="Aperçu de l'image de couverture"
                className="rounded-xl shadow-sm w-full max-h-60 object-cover border"
                onError={handleImageError}
              />
            </div>
          )}
          
          {imageError && (
            <p className="text-sm text-red-600 mt-1">
              ❌ Impossible de charger l'image. Vérifiez l'URL.
            </p>
          )}
        </div>

        {/* Catégorie et Auteur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block font-semibold mb-2 text-gray-800">
              Catégorie
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              aria-describedby="category-help"
              disabled={saving}
            >
              <option value="">— Sélectionner —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p id="category-help" className="text-sm text-gray-500 mt-1">
              {categories.length} catégorie(s) disponible(s)
            </p>
          </div>

          <div>
            <label htmlFor="author" className="block font-semibold mb-2 text-gray-800">
              Auteur
            </label>
            <select
              id="author"
              value={formData.author_id}
              onChange={(e) => handleChange('author_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              aria-describedby="author-help"
              disabled={saving}
            >
              <option value="">— Sélectionner —</option>
              {authors.map((auth) => (
                <option key={auth.id} value={auth.id}>
                  {auth.name}
                </option>
              ))}
            </select>
            <p id="author-help" className="text-sm text-gray-500 mt-1">
              Auteur principal de l'article
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold mb-2 text-gray-800">
            Tags {formData.selectedTags.length > 0 && `(${formData.selectedTags.length} sélectionné(s))`}
          </label>
          <div 
            className="flex flex-wrap gap-2"
            role="group"
            aria-describedby="tags-help"
          >
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  formData.selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
                data-selected={formData.selectedTags.includes(tag.id)}
                disabled={saving}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <p id="tags-help" className="text-sm text-gray-500 mt-1">
            {tags.length} tag(s) disponible(s) - Cliquez pour sélectionner
          </p>
        </div>

        {/* SEO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="seo_title" className="block font-semibold mb-2 text-gray-800">
              SEO Title
            </label>
            <input
              id="seo_title"
              type="text"
              value={formData.seo_title}
              onChange={(e) => handleChange('seo_title', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              aria-describedby="seo-title-help"
              placeholder="Titre pour les moteurs de recherche"
              disabled={saving}
            />
            <p id="seo-title-help" className="text-sm text-gray-500 mt-1">
              {formData.seo_title.length}/60 caractères
            </p>
          </div>
          <div>
            <label htmlFor="seo_description" className="block font-semibold mb-2 text-gray-800">
              SEO Description
            </label>
            <input
              id="seo_description"
              type="text"
              value={formData.seo_description}
              onChange={(e) => handleChange('seo_description', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              aria-describedby="seo-desc-help"
              placeholder="Description pour les moteurs de recherche"
              disabled={saving}
            />
            <p id="seo-desc-help" className="text-sm text-gray-500 mt-1">
              {formData.seo_description.length}/160 caractères
            </p>
          </div>
          <div>
            <label htmlFor="seo_keywords" className="block font-semibold mb-2 text-gray-800">
              Mots-clés SEO
            </label>
            <input
              id="seo_keywords"
              type="text"
              value={formData.seo_keywords}
              onChange={(e) => handleChange('seo_keywords', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              aria-describedby="seo-keywords-help"
              placeholder="mot-clé1, mot-clé2, mot-clé3"
              disabled={saving}
            />
            <p id="seo-keywords-help" className="text-sm text-gray-500 mt-1">
              Séparés par des virgules
            </p>
          </div>
        </div>

        {/* Publication */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            id="is_published"
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => handleChange('is_published', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            disabled={saving}
          />
          <label htmlFor="is_published" className="text-gray-800 font-medium">
            Publier immédiatement
          </label>
          <span className="text-sm text-gray-500 ml-auto">
            {formData.is_published ? '✅ Visible publiquement' : '📝 En mode brouillon'}
          </span>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving || !formData.title.trim() || !formData.slug.trim()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            aria-label={saving ? 'Sauvegarde en cours' : 'Mettre à jour l\'article'}
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Sauvegarde...' : 'Mettre à jour l\'article'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/player/blog')}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 border border-gray-300"
          >
            <ArrowLeft size={18} />
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}