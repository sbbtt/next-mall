import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data/products"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Grid Section - 29CM Style */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Left - Promotion Banners */}
          <div className="space-y-4">
            {/* New Arrivals */}
            <Link href="/shop?sort=newest" className="block">
              <div className="bg-[#FF6B35] text-white p-8 rounded-lg hover:opacity-90 transition-opacity h-[240px] flex flex-col justify-between">
                <div className="text-sm font-light mb-2">신상품 가득</div>
                <div className="text-5xl font-bold mb-4">NEW</div>
                <div className="h-px bg-white/30 mb-4"></div>
                <div className="text-sm uppercase tracking-wider">신상품 보기</div>
              </div>
            </Link>
            
            {/* Best Sellers */}
            <Link href="/shop?sort=price-desc" className="block">
              <div className="bg-[#4169E1] text-white p-8 rounded-lg hover:opacity-90 transition-opacity h-[240px] flex flex-col justify-between">
                <div className="text-sm font-light mb-2">프리미엄 라인</div>
                <div className="text-5xl font-bold mb-4">BEST</div>
                <div className="h-px bg-white/30 mb-4"></div>
                <div className="text-sm">프리미엄 제품 보기</div>
              </div>
            </Link>

            {/* All Products */}
            <Link href="/shop" className="block">
              <div className="bg-black text-white p-8 rounded-lg h-[160px] flex items-center justify-center hover:bg-gray-900 transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-light mb-2">전체 상품 보기</div>
                  <div className="text-3xl font-bold">VIEW ALL</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right - Large Product Images */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Furniture */}
            <Link href="/shop?category=furniture" className="relative group overflow-hidden rounded-lg h-[500px] md:h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img 
                src="/images/modern-beige-lounge-chair.jpg" 
                alt="Furniture Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-8 left-8 z-20 text-white">
                <div className="text-sm mb-2">가구 컬렉션</div>
                <div className="text-4xl font-bold tracking-tight">FURNITURE</div>
              </div>
            </Link>

            {/* Lighting */}
            <Link href="/shop?category=lighting" className="relative group overflow-hidden rounded-lg h-[500px] md:h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img 
                src="/images/modern-sculptural-floor-lamp.jpg" 
                alt="Lighting Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-8 left-8 z-20 text-white">
                <div className="text-sm mb-2">조명 컬렉션</div>
                <div className="text-4xl font-bold tracking-tight">LIGHTING</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Link 
            href="/shop" 
            className="inline-block border border-black px-12 py-3 text-sm hover:bg-black hover:text-white transition-colors"
          >
            더보기
          </Link>
        </div>
      </main>
    </div>
  )
}
