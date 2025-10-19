// lib/products.ts
import { supabase } from './server';

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('Propulser')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('❌ Erreur Supabase (getProductBySlug):', error.message);
    return null;
  }

  return data;
}

export async function getRelatedProducts(category: string, excludeSlug: string) {
  const { data, error } = await supabase
    .from('Propulser')
    .select('slug, name, price, image, category')
    .eq('category', category)
    .neq('slug', excludeSlug)
    .limit(4);

  if (error) {
    console.error('❌ Erreur Supabase (getRelatedProducts):', error.message);
    return [];
  }

  return data;
}
