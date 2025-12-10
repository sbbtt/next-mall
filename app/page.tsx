import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data/products"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroBanner />

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-balance">Featured Products</h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Explore our curated selection of contemporary pieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
