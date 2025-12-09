import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data/products';

export default async function page({searchParams}:{searchParams: Promise<{search: string}>}) {
  const {search} = await searchParams;
  console.log("search: "+search)
 return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Shop All Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover our curated collection of modern furniture and home decor pieces designed to elevate your living
            space.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  )
}


