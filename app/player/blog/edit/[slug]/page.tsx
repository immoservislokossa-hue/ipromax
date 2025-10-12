'use client';

import { useState, useEffect } from 'react';
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
import { useAuthRedirect } from '../../../../hooks/useAuthRedirect';

// ✅ Chargement dynamique du Tiptap Editor
const TiptapEditor = dynamic(() => import('@/app/player/blog/TiptapEditor'), {
  ssr: false,
});

export default function EditBlogPage() {
  const supabase = createClient();
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
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

  // Redirection si non authentifié
  useAuthRedirect();

  // 🔹 Charger les données
  useEffect(() => {
    const fetchData = async () => {
      const [{ data: post }, { data: cats }, { data: tgs }, { data: auth }] = await Promise.all([
        supabase
          .from('blog_posts')
          .select(
            `*, 
            blog_post_tags(tag_id)`
          )
          .eq('slug', slug)
          .single(),
        supabase.from('blog_categories').select('*').order('name'),
        supabase.from('blog_tags').select('*').order('name'),
        supabase.from('authors').select('id, name'),
      ]);

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
        category_id: post.category_id || '',
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
      setLoading(false);
    };

    fetchData();
  }, [slug, supabase, router]);

  // 🔹 Mise à jour du formulaire
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
      slug: field === 'title' ? slugify(value, { lower: true, strict: true }) : prev.slug,
    }));
  };

  // 🔹 Sauvegarde des modifications
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1️⃣ Mise à jour du post
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          cover_image: formData.cover_image,
          category_id: formData.category_id || null,
          author_id: formData.author_id || null,
          seo_title: formData.seo_title,
          seo_description: formData.seo_description,
          seo_keywords: formData.seo_keywords,
          is_published: formData.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug);

      if (updateError) throw updateError;

      // 2️⃣ Récupérer l'ID du post à partir du slug
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .single();

      if (postError || !post) {
        throw new Error(`Article introuvable pour le slug "${slug}"`);
      }

      // 3️⃣ Supprimer les anciens tags
      const { error: deleteError } = await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', post.id);

      if (deleteError) throw deleteError;

      // 4️⃣ Réinsérer les nouveaux tags (si existants)
      if (formData.selectedTags.length > 0) {
        const relations = formData.selectedTags.map((tagId: number) => ({
          post_id: post.id,
          tag_id: tagId,
        }));

        const { error: insertError } = await supabase
          .from('blog_post_tags')
          .insert(relations);

        if (insertError) throw insertError;
      }

      // ✅ Succès
      alert('✅ Article mis à jour avec succès !');
      router.push('/player/blog');
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde :', err);
      alert(`❌ Erreur : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Chargement...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✏️ Modifier l'article
        </motion.h1>

        <button
          onClick={() => router.push('/player/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition"
          aria-label="Retour à la liste des articles"
        >
          <ArrowLeft size={18} /> Retour
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="space-y-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block font-semibold mb-1 text-gray-800">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            aria-required="true"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block font-semibold mb-1 text-gray-800">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            aria-describedby="slug-help"
          />
          <p id="slug-help" className="text-sm text-gray-500 mt-1">
            L'identifiant unique de l'article dans l'URL
          </p>
        </div>

        {/* Résumé */}
        <div>
          <label htmlFor="excerpt" className="block font-semibold mb-1 text-gray-800">
            Résumé
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-4 py-2"
            aria-describedby="excerpt-help"
          />
          <p id="excerpt-help" className="text-sm text-gray-500 mt-1">
            Court résumé qui apparaîtra dans les aperçus
          </p>
        </div>

        {/* Contenu */}
        <div>
          <label htmlFor="content" className="block font-semibold mb-1 text-gray-800">
            Contenu de l'article
          </label>
          <TiptapEditor
            content={formData.content}
            onChange={(value) => handleChange('content', value)}
            aria-describedby="content-help"
          />
          <p id="content-help" className="text-sm text-gray-500 mt-1">
            Contenu principal de l'article avec mise en forme
          </p>
        </div>

        {/* Image */}
        <div>
          <label htmlFor="cover_image" className="block font-semibold mb-1 text-gray-800">
            Image de couverture
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="cover_image"
              type="url"
              value={formData.cover_image}
              onChange={(e) => handleChange('cover_image', e.target.value)}
              placeholder="https://..."
              className="w-full border rounded-lg px-4 py-2"
              aria-describedby="image-help"
            />
            <Upload size={20} className="text-gray-500" aria-hidden="true" />
          </div>
          <p id="image-help" className="text-sm text-gray-500 mt-1">
            URL de l'image de couverture de l'article
          </p>
          {formData.cover_image && (
            <img
              src={formData.cover_image}
              alt="Aperçu de l'image de couverture"
              className="mt-3 rounded-xl shadow-sm w-full max-h-60 object-cover"
            />
          )}
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="category" className="block font-semibold mb-1 text-gray-800">
            Catégorie
          </label>
          <select
            id="category"
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            aria-describedby="category-help"
          >
            <option value="">— Sélectionner —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p id="category-help" className="text-sm text-gray-500 mt-1">
            Catégorie principale de l'article
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Tags
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
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    selectedTags: prev.selectedTags.includes(tag.id)
                      ? prev.selectedTags.filter((id: number) => id !== tag.id)
                      : [...prev.selectedTags, tag.id],
                  }))
                }
                className={`px-3 py-1 rounded-full border ${
                  formData.selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={formData.selectedTags.includes(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <p id="tags-help" className="text-sm text-gray-500 mt-1">
            Sélectionnez les tags associés à l'article
          </p>
        </div>

        {/* Auteur */}
        <div>
          <label htmlFor="author" className="block font-semibold mb-1 text-gray-800">
            Auteur
          </label>
          <select
            id="author"
            value={formData.author_id}
            onChange={(e) => handleChange('author_id', e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            aria-describedby="author-help"
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

        {/* SEO */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="seo_title" className="block font-semibold mb-1 text-gray-800">
              SEO Title
            </label>
            <input
              id="seo_title"
              type="text"
              value={formData.seo_title}
              onChange={(e) => handleChange('seo_title', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              aria-describedby="seo-title-help"
            />
            <p id="seo-title-help" className="text-sm text-gray-500 mt-1">
              Titre pour les moteurs de recherche
            </p>
          </div>
          <div>
            <label htmlFor="seo_description" className="block font-semibold mb-1 text-gray-800">
              SEO Description
            </label>
            <input
              id="seo_description"
              type="text"
              value={formData.seo_description}
              onChange={(e) => handleChange('seo_description', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              aria-describedby="seo-desc-help"
            />
            <p id="seo-desc-help" className="text-sm text-gray-500 mt-1">
              Description pour les moteurs de recherche
            </p>
          </div>
          <div>
            <label htmlFor="seo_keywords" className="block font-semibold mb-1 text-gray-800">
              SEO Keywords
            </label>
            <input
              id="seo_keywords"
              type="text"
              value={formData.seo_keywords}
              onChange={(e) => handleChange('seo_keywords', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              aria-describedby="seo-keywords-help"
            />
            <p id="seo-keywords-help" className="text-sm text-gray-500 mt-1">
              Mots-clés séparés par des virgules
            </p>
          </div>
        </div>

        {/* Publication */}
        <div className="flex items-center gap-2">
          <input
            id="is_published"
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => handleChange('is_published', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="is_published" className="text-gray-800">
            Publier immédiatement
          </label>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          aria-label={saving ? 'Sauvegarde en cours' : 'Mettre à jour l article'}
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          {saving ? 'Sauvegarde...' : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}