// app/player/produits/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { motion } from 'framer-motion';
import { 
  Save, Eye, X, Plus, 
  Tag, FolderOpen, Link as LinkIcon,
  ArrowLeft, DollarSign, Star, ShoppingCart,
  Package, Truck, FileText, Zap,
  Crown, BadgePercent, BarChart3
} from 'lucide-react';
import TiptapEditor from '@/components/editor/TiptapEditor';

interface Product {
  slug: string;
  name: string;
  description?: string;
  detailed_description?: string;
  price?: number;
  original_price?: number;
  rating?: number;
  purchase_count?: number;
  image?: string;
  is_new?: boolean;
  promo?: boolean;
  is_luxury?: boolean;
  category: string;
  brand?: string;
  features?: string;
  benefits?: string;
  delivery_info?: string;
  file_format?: string;
  access_type?: string;
  order_link?: string;
  instock?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export default function NewProduct() {
  const router = useRouter();
  const supabase = createClient();
  
  // États du formulaire
  const [formData, setFormData] = useState<Product>({
    slug: '',
    name: '',
    description: '',
    detailed_description: '',
    price: undefined,
    original_price: undefined,
    rating: 3,
    purchase_count: 5,
    image: '',
    is_new: false,
    promo: false,
    is_luxury: false,
    category: '',
    brand: '',
    features: '',
    benefits: '',
    delivery_info: '',
    file_format: '',
    access_type: '',
    order_link: '',
    instock: true,
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });
  
  // États d'interface
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Données chargées depuis Supabase
  const [existingProducts, setExistingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [accessTypes, setAccessTypes] = useState<string[]>([]);
  const [fileFormats, setFileFormats] = useState<string[]>([]);
  
  // Chargement des données
  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      console.log('🔄 Vérification de l\'authentification...');

      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        console.error('❌ Erreur utilisateur:', userError);
        setError('Vous devez être connecté pour créer un produit');
        setIsLoadingData(false);
        return;
      }

      setUser(currentUser);
      
      const isUserAdmin = currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      if (!isUserAdmin) {
        setError('Accès réservé à l\'administrateur');
        setIsLoadingData(false);
        return;
      }

      setIsAdmin(true);
      await loadAllData();
      
    } catch (error) {
      console.error('❌ Erreur globale:', error);
      setError('Erreur lors du chargement des données');
      setIsLoadingData(false);
    }
  };

  const loadAllData = async () => {
    try {
      console.log('📦 Chargement des données produits...');
      
      // Charger les produits existants
      const { data: products, error: productsError } = await supabase
        .from('Propulser')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      if (products) {
        setExistingProducts(products);
        
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
        
        // Extraire les marques uniques
        const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[];
        setBrands(uniqueBrands);
        
        // Extraire les types d'accès uniques
        const uniqueAccessTypes = [...new Set(products.map(p => p.access_type).filter(Boolean))] as string[];
        setAccessTypes(uniqueAccessTypes);
        
        // Extraire les formats de fichier uniques
        const uniqueFileFormats = [...new Set(products.map(p => p.file_format).filter(Boolean))] as string[];
        setFileFormats(uniqueFileFormats);
      }

      console.log('✅ Données chargées avec succès');
      setIsLoadingData(false);
      
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      setError('Erreur lors du chargement des données');
      setIsLoadingData(false);
    }
  };
  
  // Génération automatique du slug
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);
  
  // Gestion des changements de formulaire
  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };
  
  // Gestion du contenu Tiptap
  const handleDetailedDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, detailed_description: content }));
  };

  const handleFeaturesChange = (content: string) => {
    setFormData(prev => ({ ...prev, features: content }));
  };

  const handleBenefitsChange = (content: string) => {
    setFormData(prev => ({ ...prev, benefits: content }));
  };
  
  // Validation du formulaire
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom du produit est obligatoire');
      return false;
    }
    if (!formData.slug.trim()) {
      setError('Le slug est obligatoire');
      return false;
    }
    if (!formData.category.trim()) {
      setError('La catégorie est obligatoire');
      return false;
    }
    
    // Vérifier si le slug existe déjà
    const slugExists = existingProducts.some(product => 
      product.slug === formData.slug
    );
    
    if (slugExists) {
      setError('Un produit avec ce slug existe déjà');
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
  
  // Soumission du formulaire
  const handleSubmit = async () => {
    setError('');
    
    if (!user) {
      setError('Vous devez être connecté pour créer un produit');
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
      const productData = {
        slug: formData.slug.trim(),
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        detailed_description: formData.detailed_description || null,
        price: formData.price || null,
        original_price: formData.original_price || null,
        rating: formData.rating || 3,
        purchase_count: formData.purchase_count || 5,
        image: formData.image?.trim() || null,
        is_new: formData.is_new || false,
        promo: formData.promo || false,
        is_luxury: formData.is_luxury || false,
        category: formData.category.trim(),
        brand: formData.brand?.trim() || null,
        features: formData.features || null,
        benefits: formData.benefits || null,
        delivery_info: formData.delivery_info?.trim() || null,
        file_format: formData.file_format?.trim() || null,
        access_type: formData.access_type?.trim() || null,
        order_link: formData.order_link?.trim() || null,
        instock: formData.instock !== undefined ? formData.instock : true,
        seo_title: formData.seo_title?.trim() || null,
        seo_description: formData.seo_description?.trim() || null,
        seo_keywords: formData.seo_keywords?.trim() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('📝 Création du produit...', productData);
      
      // Création du produit
      const { data: product, error: productError } = await supabase
        .from('Propulser')
        .insert([productData])
        .select()
        .single();
      
      if (productError) {
        console.error('❌ Erreur Supabase:', productError);
        
        if (productError.code === '23505') {
          setError('Un produit avec ce slug existe déjà');
        } else {
          setError(`Erreur lors de la création: ${productError.message}`);
        }
        return;
      }
      
      alert('✅ Produit créé avec succès !');
      router.push('/player/produits');
      
    } catch (error) {
      console.error('❌ Erreur création produit:', error);
      setError('Erreur inattendue lors de la création du produit');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Rendu du preview
  const renderPreview = () => (
    <div className="bg-white rounded-lg border p-6">
      <h1 className="text-3xl font-bold mb-4">{formData.name || 'Nom du produit'}</h1>
      
      {formData.image && (
        <img 
          src={formData.image} 
          alt="Produit" 
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      
      {formData.description && (
        <p className="text-gray-600 text-lg mb-6 italic">{formData.description}</p>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <strong>Prix:</strong> {formData.price ? `${formData.price}€` : 'Non défini'}
        </div>
        <div>
          <strong>Catégorie:</strong> {formData.category || 'Non définie'}
        </div>
        <div>
          <strong>Marque:</strong> {formData.brand || 'Non définie'}
        </div>
        <div>
          <strong>En stock:</strong> {formData.instock ? 'Oui' : 'Non'}
        </div>
      </div>
      
      {formData.detailed_description && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Description détaillée</h3>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.detailed_description }}
          />
        </div>
      )}
      
      {formData.features && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Caractéristiques</h3>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.features }}
          />
        </div>
      )}
      
      {formData.benefits && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Avantages</h3>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.benefits }}
          />
        </div>
      )}
    </div>
  );

  // Écran de chargement
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
            <p className="text-gray-600">Vérification de l'authentification</p>
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
              onClick={() => router.push('/player/produits')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} />
              Retour aux produits
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau Produit</h1>
          <p className="text-gray-600 mt-2">Créez un nouveau produit pour votre boutique</p>
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
            {/* Informations de base */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Informations du produit
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de votre produit..."
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
                    placeholder="url-du-produit"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ceci formera l'URL de votre produit: /produits/{formData.slug}
                  </p>
                </div>
                
                {/* Description courte */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description courte
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description courte du produit..."
                  />
                </div>
                
                {/* Catégorie */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Nouvelle catégorie"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const newCat = (e.target as HTMLInputElement).value.trim();
                          if (newCat && !categories.includes(newCat)) {
                            setCategories(prev => [...prev, newCat]);
                            handleInputChange('category', newCat);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Marque */}
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Marque
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez une marque</option>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Nouvelle marque"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const newBrand = (e.target as HTMLInputElement).value.trim();
                          if (newBrand && !brands.includes(newBrand)) {
                            setBrands(prev => [...prev, newBrand]);
                            handleInputChange('brand', newBrand);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description détaillée avec Tiptap */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description détaillée
                </h2>
              </div>
              <div className="p-6">
                <TiptapEditor
                  content={formData.detailed_description || ''}
                  onChange={handleDetailedDescriptionChange}
                  placeholder="Description complète du produit..."
                />
              </div>
            </motion.div>

            {/* Caractéristiques avec Tiptap */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Caractéristiques
                </h2>
              </div>
              <div className="p-6">
                <TiptapEditor
                  content={formData.features || ''}
                  onChange={handleFeaturesChange}
                  placeholder="Liste des caractéristiques du produit..."
                />
              </div>
            </motion.div>

            {/* Avantages avec Tiptap */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Avantages
                </h2>
              </div>
              <div className="p-6">
                <TiptapEditor
                  content={formData.benefits || ''}
                  onChange={handleBenefitsChange}
                  placeholder="Avantages et bénéfices du produit..."
                />
              </div>
            </motion.div>
          </div>
          
          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Publication */}
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
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Création...' : 'Créer le produit'}
                </button>
                
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Eye className="w-4 h-4" />
                  {isPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
                </button>
              </div>
            </motion.div>

            {/* Prix et stock */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Prix & Stock
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Prix actuel */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (€)
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="29.99"
                  />
                </div>
                
                {/* Prix original */}
                <div>
                  <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Prix original (€)
                  </label>
                  <input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price || ''}
                    onChange={(e) => handleInputChange('original_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="49.99"
                  />
                </div>
                
                {/* Note */}
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Note (1-5)
                  </label>
                  <input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating || 3}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Nombre d'achats */}
                <div>
                  <label htmlFor="purchase_count" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'achats
                  </label>
                  <input
                    id="purchase_count"
                    type="number"
                    value={formData.purchase_count || 5}
                    onChange={(e) => handleInputChange('purchase_count', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* En stock */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="instock"
                    checked={formData.instock}
                    onChange={(e) => handleInputChange('instock', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="instock" className="text-sm text-gray-700">
                    En stock
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Options du produit */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Options
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Nouveau */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_new"
                    checked={formData.is_new}
                    onChange={(e) => handleInputChange('is_new', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_new" className="text-sm text-gray-700">
                    <BadgePercent className="w-4 h-4 inline mr-1" />
                    Nouveau produit
                  </label>
                </div>
                
                {/* Promo */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="promo"
                    checked={formData.promo}
                    onChange={(e) => handleInputChange('promo', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="promo" className="text-sm text-gray-700">
                    <BadgePercent className="w-4 h-4 inline mr-1" />
                    En promotion
                  </label>
                </div>
                
                {/* Luxe */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_luxury"
                    checked={formData.is_luxury}
                    onChange={(e) => handleInputChange('is_luxury', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_luxury" className="text-sm text-gray-700">
                    <Crown className="w-4 h-4 inline mr-1" />
                    Produit luxueux
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Livraison et accès */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Livraison & Accès
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Type d'accès */}
                <div>
                  <label htmlFor="access_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'accès
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="access_type"
                      value={formData.access_type}
                      onChange={(e) => handleInputChange('access_type', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez un type</option>
                      {accessTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Nouveau type"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const newType = (e.target as HTMLInputElement).value.trim();
                          if (newType && !accessTypes.includes(newType)) {
                            setAccessTypes(prev => [...prev, newType]);
                            handleInputChange('access_type', newType);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Format de fichier */}
                <div>
                  <label htmlFor="file_format" className="block text-sm font-medium text-gray-700 mb-2">
                    Format de fichier
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="file_format"
                      value={formData.file_format}
                      onChange={(e) => handleInputChange('file_format', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez un format</option>
                      {fileFormats.map((format, index) => (
                        <option key={index} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Nouveau format"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const newFormat = (e.target as HTMLInputElement).value.trim();
                          if (newFormat && !fileFormats.includes(newFormat)) {
                            setFileFormats(prev => [...prev, newFormat]);
                            handleInputChange('file_format', newFormat);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Lien de commande */}
                <div>
                  <label htmlFor="order_link" className="block text-sm font-medium text-gray-700 mb-2">
                    Lien de commande
                  </label>
                  <input
                    id="order_link"
                    type="url"
                    value={formData.order_link}
                    onChange={(e) => handleInputChange('order_link', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                
                {/* Info livraison */}
                <div>
                  <label htmlFor="delivery_info" className="block text-sm font-medium text-gray-700 mb-2">
                    Information de livraison
                  </label>
                  <textarea
                    id="delivery_info"
                    value={formData.delivery_info}
                    onChange={(e) => handleInputChange('delivery_info', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Délais de livraison, frais, etc."
                  />
                </div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Image du produit
                </h2>
              </div>
              
              <div className="p-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'image
                </label>
                
                {formData.image ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img 
                        src={formData.image} 
                        alt="Aperçu du produit" 
                        className="w-64 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <button
                        onClick={() => handleInputChange('image', '')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        title="Supprimer l'image"
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
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Collez l'URL complète de l'image
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* SEO */}
            <motion.div 
              className="bg-white rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
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
                <h2 className="text-xl font-semibold">Aperçu du produit</h2>
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