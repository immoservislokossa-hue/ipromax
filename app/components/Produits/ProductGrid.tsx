import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, idx) => {
        // Always provide a unique key: prefer _id, then id, then slug, then fallback to index (with warning)
        const key = product._id || product.id || product.slug || `idx-${idx}`;
        if (!product._id && !product.id && !product.slug) {
          console.warn('Product item missing unique identifier:', product);
        }
        return (
          <ProductCard
            key={key}
            product={product}
          />
        );
      })}
    </div>
  );
}
