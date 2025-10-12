'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/app/utils/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, Upload, Save } from 'lucide-react';
import slugify from 'slugify';
import { useAuthRedirect } from '../../../hooks/useAuthRedirect';

// ✅ Chargement dynamique de l’éditeur (évite SSR crash)
const TiptapEditor = dynamic(() => import('../TiptapEditor'), {
  ssr: false,
});

export default function NewBlogPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

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

  useAuthRedirect();

  // 🔹 Charger les catégories, tags, auteurs
  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase.from('blog_categories').select('*').order('name');
      const { data: tgs } = await supabase.from('blog_tags').select('*').order('name');
      const { data: auth } = await supabase.from('authors').select('id, name');
      setCategories(cats || []);
      setTags(tgs || []);
      setAuthors(auth || []);
    };
    fetchData();
  }, [supabase]);

  // 🔹 Mettre à jour les champs du formulaire
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      slug: field === 'title' ? slugify(value, { lower: true, strict: true }) : prev.slug,
    }));
  };

  // 🔹 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Créer le post principal
      const { data: post, error } = await supabase
        .from('blog_posts')
        .insert([
          {
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
          },
        ])
        .select('id')
        .single();

      if (error) throw error;

      // 2️⃣ Associer les tags
      if (formData.selectedTags.length > 0) {
        const tagRelations = formData.selectedTags.map((tagId) => ({
          post_id: post.id,
          tag_id: tagId,
        }));
        await supabase.from('blog_post_tags').insert(tagRelations);
      }

      alert('✅ Article créé avec succès !');
      router.push('/player/blog');
    } catch (err: any) {
      console.error(err);
      alert(`Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-6 text-blue-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📝 Nouveau Blog
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* TITRE */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Titre</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* SLUG */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* EXCERPT */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Résumé</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            rows={3}
          />
        </div>

        {/* CONTENU */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Contenu</label>
          <TiptapEditor content={formData.content} onChange={(value) => handleChange('content', value)} />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Image de couverture (URL)</label>
          <div className="flex items-center gap-3">
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => handleChange('cover_image', e.target.value)}
              placeholder="https://..."
              className="w-full border rounded-lg px-4 py-2"
            />
            <Upload className="text-gray-400" />
          </div>
        </div>

        {/* CATÉGORIE */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Catégorie</label>
          <select
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">— Sélectionner —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* TAGS */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedTags: prev.selectedTags.includes(tag.id)
                      ? prev.selectedTags.filter((id) => id !== tag.id)
                      : [...prev.selectedTags, tag.id],
                  }))
                }
                className={`px-3 py-1 rounded-full border ${
                  formData.selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* AUTEUR */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Auteur</label>
          <select
            value={formData.author_id}
            onChange={(e) => handleChange('author_id', e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">— Sélectionner —</option>
            {authors.map((auth) => (
              <option key={auth.id} value={auth.id}>
                {auth.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEO */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-800">SEO Title</label>
            <input
              type="text"
              value={formData.seo_title}
              onChange={(e) => handleChange('seo_title', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">SEO Description</label>
            <input
              type="text"
              value={formData.seo_description}
              onChange={(e) => handleChange('seo_description', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">SEO Keywords</label>
            <input
              type="text"
              value={formData.seo_keywords}
              onChange={(e) => handleChange('seo_keywords', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* PUBLIÉ */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => handleChange('is_published', e.target.checked)}
          />
          <span>Publier immédiatement</span>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save />}
          {loading ? 'Enregistrement...' : 'Publier l’article'}
        </button>
      </form>
    </div>
  );
}
