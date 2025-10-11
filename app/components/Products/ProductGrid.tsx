import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard
          key={product._id || product.id}
          product={product}
        />
      ))}
    </div>
  );
}
