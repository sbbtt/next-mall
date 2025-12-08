import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { ProductCard } from "@/components/product-card"

const products = [
  {
    id: 1,
    name: "Minimalist Lounge Chair",
    price: 599,
    category: "Furniture",
    image: "/images/modern-beige-lounge-chair.jpg",
  },
  {
    id: 2,
    name: "Ceramic Vase Set",
    price: 89,
    category: "Decor",
    image: "/images/minimalist-ceramic-vase-set.png",
  },
  {
    id: 3,
    name: "Wooden Side Table",
    price: 249,
    category: "Furniture",
    image: "/images/modern-wooden-side-table.jpg",
  },
  {
    id: 4,
    name: "Textured Throw Pillow",
    price: 45,
    category: "Textiles",
    image: "/images/modern-textured-throw-pillow.jpg",
  },
  {
    id: 5,
    name: "Abstract Wall Art",
    price: 179,
    category: "Art",
    image: "/images/abstract-modern-wall-art.jpg",
  },
  {
    id: 6,
    name: "Sculptural Floor Lamp",
    price: 329,
    category: "Lighting",
    image: "/images/modern-sculptural-floor-lamp.jpg",
  },
  {
    id: 7,
    name: "Linen Bedding Set",
    price: 159,
    category: "Textiles",
    image: "/images/natural-linen-bedding-set.jpg",
  },
  {
    id: 8,
    name: "Modern Console Table",
    price: 449,
    category: "Furniture",
    image: "/images/modern-console-table-wood.jpg",
  },
]

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
              name={product.name}
              price={product.price}
              category={product.category}
              image={product.image}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
