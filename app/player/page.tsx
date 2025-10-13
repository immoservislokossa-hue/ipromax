'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FaPenFancy,
  FaShoppingBag,
  FaUsers,
  FaEye,
  FaShieldAlt,
  FaEnvelope,
  FaServer,
  FaMoneyBillWave,
  FaUser,
  FaSignOutAlt,
  FaTags,
  FaFolder,
  FaChartBar,
  FaList,
  FaIdCard,
  FaCalendar,
  FaPhone,
  FaFileAlt
} from 'react-icons/fa';

export default function EpropulseDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [intrusions, setIntrusions] = useState<any[]>([]);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [blogStats, setBlogStats] = useState<any>({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Produits
        const { data: propulser } = await supabase
          .from('Propulser')
          .select('*')
          .order('created_at', { ascending: false });

        // Articles blog
        const { data: blog } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        // Articles publiés
        const { data: published } = await supabase
          .from('published_blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        // Auteurs
        const { data: authorsData } = await supabase
          .from('authors')
          .select('*')
          .order('created_at', { ascending: false });

        // Catégories
        const { data: categoriesData } = await supabase
          .from('blog_categories')
          .select('*')
          .order('created_at', { ascending: false });

        // Tags
        const { data: tagsData } = await supabase
          .from('blog_tags')
          .select('*')
          .order('created_at', { ascending: false });

        // Statistiques blog
        const { data: blogStatsData } = await supabase
          .from('blog_admin_stats')
          .select('*')
          .single();

        // Leads
        const { data: leadsData } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        // Intrusions
        const { data: intrusionData } = await supabase
          .from('intrusions')
          .select('*')
          .order('created_at', { ascending: false });

        // Logs de connexion
        const { data: loginData } = await supabase
          .from('login_logs')
          .select('*')
          .order('created_at', { ascending: false });

        // Tentatives de connexion
        const { data: loginAttemptsData } = await supabase
          .from('login_attempts')
          .select('*')
          .order('last_attempt_at', { ascending: false });

        // Messages (messagepro)
        const { data: messagesData } = await supabase
          .from('messagepro')
          .select('*')
          .order('created_at', { ascending: false });

        // Messages (messages)
        const { data: messages2Data } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        // Emails
        const { data: emailsData } = await supabase
          .from('email')
          .select('*')
          .order('created_at', { ascending: false });

        // Calcul des statistiques
        const totalRevenue = propulser?.reduce(
          (sum, p) => sum + ((p.price || 0) * (p.purchase_count || 0)),
          0
        ) || 0;

        const totalViews = blog?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
        const publishedPosts = blog?.filter(post => post.is_published) || [];
        const draftPosts = blog?.filter(post => !post.is_published) || [];

        setStats({
          totalProducts: propulser?.length || 0,
          totalArticles: blog?.length || 0,
          totalPublished: publishedPosts.length,
          totalDrafts: draftPosts.length,
          totalAuthors: authorsData?.length || 0,
          totalCategories: categoriesData?.length || 0,
          totalTags: tagsData?.length || 0,
          totalLeads: leadsData?.length || 0,
          totalIntrusions: intrusionData?.length || 0,
          totalLoginAttempts: loginAttemptsData?.length || 0,
          totalMessages: (messagesData?.length || 0) + (messages2Data?.length || 0),
          totalEmails: emailsData?.length || 0,
          totalRevenue,
          totalViews,
        });

        setProducts(propulser || []);
        setPosts(blog || []);
        setPublishedPosts(published || []);
        setAuthors(authorsData || []);
        setCategories(categoriesData || []);
        setTags(tagsData || []);
        setLeads(leadsData || []);
        setIntrusions(intrusionData || []);
        setLoginLogs(loginData || []);
        setLoginAttempts(loginAttemptsData || []);
        setMessages(messagesData || []);
        setEmails(emailsData || []);
        setBlogStats(blogStatsData || {});
      } catch (err) {
        console.error('Erreur dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/secure-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Epropulse Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <FaSignOutAlt /> Déconnexion
        </button>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 space-y-10">
        {/* Statistiques Principales */}
        <section>
          <h2 className="text-xl font-bold mb-6">Aperçu Global</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[
              { label: 'Produits', value: stats.totalProducts, icon: <FaShoppingBag className="text-blue-600" /> },
              { label: 'Articles Total', value: stats.totalArticles, icon: <FaPenFancy className="text-green-600" /> },
              { label: 'Articles Publiés', value: stats.totalPublished, icon: <FaEye className="text-emerald-600" /> },
              { label: 'Brouillons', value: stats.totalDrafts, icon: <FaList className="text-yellow-600" /> },
              { label: 'Auteurs', value: stats.totalAuthors, icon: <FaUser className="text-purple-600" /> },
              { label: 'Catégories', value: stats.totalCategories, icon: <FaFolder className="text-indigo-600" /> },
              { label: 'Tags', value: stats.totalTags, icon: <FaTags className="text-pink-600" /> },
              { label: 'Leads', value: stats.totalLeads, icon: <FaUsers className="text-orange-600" /> },
              { label: 'Vues Total', value: stats.totalViews, icon: <FaChartBar className="text-teal-600" /> },
              { label: 'Intrusions', value: stats.totalIntrusions, icon: <FaShieldAlt className="text-red-600" /> },
              { label: 'Tentatives Connexion', value: stats.totalLoginAttempts, icon: <FaServer className="text-gray-600" /> },
              { label: 'Messages', value: stats.totalMessages, icon: <FaEnvelope className="text-blue-500" /> },
              { label: 'Emails', value: stats.totalEmails, icon: <FaIdCard className="text-green-500" /> },
              { label: 'Revenus Totaux', value: `${stats.totalRevenue?.toLocaleString() || 0} FCFA`, icon: <FaMoneyBillWave className="text-emerald-500" /> },
            ].map((s, i) => (
              <div key={i} className="bg-white border rounded-lg shadow p-4 flex items-center space-x-4 hover:shadow-md transition-shadow">
                <div className="text-2xl">
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistiques Blog Détaillées */}
        {blogStats && (
          <section className="bg-white border rounded-lg shadow">
            <h2 className="text-lg font-semibold border-b px-6 py-4">Statistiques Blog Détaillées</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{blogStats.total_posts || 0}</p>
                <p className="text-sm text-gray-600">Total Articles</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{blogStats.published_posts || 0}</p>
                <p className="text-sm text-gray-600">Publiés</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{blogStats.draft_posts || 0}</p>
                <p className="text-sm text-gray-600">Brouillons</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{blogStats.total_views || 0}</p>
                <p className="text-sm text-gray-600">Vues Total</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{blogStats.total_authors || 0}</p>
                <p className="text-sm text-gray-600">Auteurs</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-2xl font-bold text-pink-600">{blogStats.total_categories || 0}</p>
                <p className="text-sm text-gray-600">Catégories</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <p className="text-2xl font-bold text-teal-600">{blogStats.total_tags || 0}</p>
                <p className="text-sm text-gray-600">Tags</p>
              </div>
            </div>
          </section>
        )}

        {/* Produits */}
        <section className="bg-white border rounded-lg shadow">
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Produits ({products.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Prix</th>
                  <th className="px-4 py-3 font-medium">Promo</th>
                  <th className="px-4 py-3 font-medium">Ventes</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Marque</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Nouveau</th>
                  <th className="px-4 py-3 font-medium">Luxe</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{p.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold">{p.price?.toLocaleString()} FCFA</span>
                        {p.original_price && p.original_price > p.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {p.original_price?.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.promo ? '✅' : '❌'}</td>
                    <td className="px-4 py-3">{p.purchase_count || 0}</td>
                    <td className="px-4 py-3">{p.rating || 'N/A'}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">{p.brand || '-'}</td>
                    <td className="px-4 py-3">{p.instock ? '✅' : '❌'}</td>
                    <td className="px-4 py-3">{p.is_new ? '✅' : '❌'}</td>
                    <td className="px-4 py-3">{p.is_luxury ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {format(new Date(p.created_at), 'dd/MM/yy', { locale: fr })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Articles Blog */}
        <section className="bg-white border rounded-lg shadow">
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Articles Blog ({posts.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Titre</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Vues</th>
                  <th className="px-4 py-3 font-medium">Auteur</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Publication</th>
                  <th className="px-4 py-3 font-medium">Mise à jour</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.is_published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{post.views || 0}</td>
                    <td className="px-4 py-3">{post.author_id ? 'Oui' : 'Non'}</td>
                    <td className="px-4 py-3">{post.category_id ? 'Oui' : 'Non'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {post.published_at ? format(new Date(post.published_at), 'dd/MM/yy', { locale: fr }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {post.updated_at ? format(new Date(post.updated_at), 'dd/MM/yy', { locale: fr }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Articles Publiés (Vue Aggrégée) */}
        {publishedPosts.length > 0 && (
          <section className="bg-white border rounded-lg shadow">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Articles Publiés - Vue Aggrégée ({publishedPosts.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Titre</th>
                    <th className="px-4 py-3 font-medium">Auteur</th>
                    <th className="px-4 py-3 font-medium">Catégorie</th>
                    <th className="px-4 py-3 font-medium">Tags</th>
                    <th className="px-4 py-3 font-medium">Vues</th>
                    <th className="px-4 py-3 font-medium">Publication</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {publishedPosts.map((post) => (
                    <tr key={post.slug} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                      <td className="px-4 py-3">{post.author_name || 'Inconnu'}</td>
                      <td className="px-4 py-3">{post.category_name || '-'}</td>
                      <td className="px-4 py-3 text-xs">
                        {(post.tags || []).slice(0, 3).join(', ')}
                        {(post.tags || []).length > 3 && '...'}
                      </td>
                      <td className="px-4 py-3">{post.views || 0}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {post.published_at ? format(new Date(post.published_at), 'dd/MM/yy', { locale: fr }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Auteurs */}
        <section className="bg-white border rounded-lg shadow">
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Auteurs ({authors.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Rôle</th>
                  <th className="px-4 py-3 font-medium">Bio</th>
                  <th className="px-4 py-3 font-medium">Avatar</th>
                  <th className="px-4 py-3 font-medium">Réseaux sociaux</th>
                  <th className="px-4 py-3 font-medium">Date création</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{author.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {author.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">{author.bio || 'Aucune bio'}</td>
                    <td className="px-4 py-3">{author.avatar ? '✅' : '❌'}</td>
                    <td className="px-4 py-3">{author.social_links ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {format(new Date(author.created_at), 'dd/MM/yy', { locale: fr })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Catégories et Tags */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Catégories */}
          <section className="bg-white border rounded-lg shadow">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Catégories ({categories.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Date création</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{category.name}</td>
                      <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{category.description || 'Aucune description'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {format(new Date(category.created_at), 'dd/MM/yy', { locale: fr })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tags */}
          <section className="bg-white border rounded-lg shadow">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Tags ({tags.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Date création</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{tag.name}</td>
                      <td className="px-4 py-3 text-gray-500">{tag.slug}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {format(new Date(tag.created_at), 'dd/MM/yy', { locale: fr })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Leads */}
        <section className="bg-white border rounded-lg shadow">
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Leads ({leads.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Budget</th>
                  <th className="px-4 py-3 font-medium">Échéance</th>
                  <th className="px-4 py-3 font-medium">Urgence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{lead.name}</span>
                        <span className="text-xs text-gray-500">{lead.email}</span>
                        <span className="text-xs text-gray-500">{lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{lead.service}</td>
                    <td className="px-4 py-3">
                      {lead.budget_min || lead.budget_max ? (
                        `${lead.budget_min || '?'} - ${lead.budget_max || '?'}`
                      ) : (
                        'Non spécifié'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {lead.deadline ? format(new Date(lead.deadline), 'dd/MM/yy', { locale: fr }) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lead.urgency === 'high' ? 'bg-red-100 text-red-800' :
                        lead.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {format(new Date(lead.created_at), 'dd/MM/yy', { locale: fr })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Logs de Sécurité */}
        <section className="bg-white border rounded-lg shadow">
          <h2 className="text-lg font-semibold border-b px-6 py-4">Logs de Sécurité</h2>
          <div className="grid md:grid-cols-3 gap-6 p-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2 text-blue-600">
                <FaServer /> Connexions ({loginLogs.length})
              </h3>
              <ul className="space-y-2 text-sm">
                {loginLogs.slice(0, 5).map((log) => (
                  <li key={log.id} className="p-3 bg-gray-50 rounded border">
                    <p className={log.success ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {log.email || 'Utilisateur inconnu'} — {log.success ? '✅ Succès' : '❌ Échec'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{log.ip}</p>
                    <p className="text-gray-400 text-xs">{log.path}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2 text-red-600">
                <FaShieldAlt /> Intrusions ({intrusions.length})
              </h3>
              <ul className="space-y-2 text-sm">
                {intrusions.slice(0, 5).map((intrusion) => (
                  <li key={intrusion.id} className="p-3 bg-red-50 rounded border">
                    <p className="text-red-800 font-medium">{intrusion.ip}</p>
                    <p className="text-gray-500 text-xs mt-1 truncate">{intrusion.user_agent}</p>
                    <p className="text-gray-400 text-xs">{intrusion.path}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2 text-orange-600">
                <FaServer /> Tentatives de Connexion ({loginAttempts.length})
              </h3>
              <ul className="space-y-2 text-sm">
                {loginAttempts.slice(0, 5).map((attempt) => (
                  <li key={attempt.id} className="p-3 bg-orange-50 rounded border">
                    <p className="text-orange-800 font-medium">{attempt.ip}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Tentatives: <strong>{attempt.attempts}</strong>
                    </p>
                    <p className="text-gray-400 text-xs">
                      {attempt.blocked_until ? '🔒 Bloqué' : '✅ Actif'}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Messages et Emails */}
        <section className="bg-white border rounded-lg shadow">
          <h2 className="text-lg font-semibold border-b px-6 py-4">Communication</h2>
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2 text-purple-600">
                <FaEnvelope /> Messages Reçus ({messages.length})
              </h3>
              <ul className="space-y-3">
                {messages.slice(0, 5).map((message) => (
                  <li key={message.id} className="p-3 bg-purple-50 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-purple-900">{message.name}</p>
                        <p className="text-purple-700 text-sm">{message.email}</p>
                      </div>
                      <span className="text-xs text-purple-500">
                        {format(new Date(message.created_at), 'dd/MM/yy', { locale: fr })}
                      </span>
                    </div>
                    <p className="text-purple-800 text-sm mt-2 line-clamp-2">{message.content}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2 text-green-600">
                <FaIdCard /> Emails Collectés ({emails.length})
              </h3>
              <ul className="space-y-2">
                {emails.slice(0, 5).map((email) => (
                  <li key={email.id} className="p-3 bg-green-50 rounded border flex justify-between items-center">
                    <p className="text-green-800 font-medium">{email.email}</p>
                    <span className="text-xs text-green-600">
                      {format(new Date(email.created_at), 'dd/MM/yy', { locale: fr })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}