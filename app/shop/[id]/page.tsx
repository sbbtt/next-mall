import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, ArrowLeft, Package, Ruler, Layers } from "lucide-react"
import { ProductImage } from "@/components/product-image"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AddToWishlistButton } from "@/components/add-to-wishlist-button"
import { createClient } from "@/lib/supabase/server"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // Supabase에서 상품 가져오기
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', Number.parseInt(resolvedParams.id))
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/shop"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <ProductImage
              src={product.image}
              alt={product.name}
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">{product.name}</h1>
            <p className="text-3xl font-semibold mb-6">{Math.floor(product.price).toLocaleString()}원</p>

            {product.in_stock ? (
              <div className="flex items-center gap-2 mb-6 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-medium">In Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                <span className="font-medium">Out of Stock</span>
              </div>
            )}

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            <div className="flex gap-3 mb-8">
              <AddToCartButton product={product} size="lg" className="flex-1" />
              <AddToWishlistButton product={product} size="lg" />
            </div>

            <Separator className="mb-8" />

            {/* Shipping Info */}
            <div className="grid gap-4">
              <Card>
                <CardContent className="flex items-start gap-3 p-4">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      50만원 이상 구매 시 무료 배송. 일반 배송 5-7일 소요.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
