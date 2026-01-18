import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export default async function ProductsPage() {
  const supabase = await createClient()
  
  // Supabase에서 상품 가져오기
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch products:', error)
  }

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products" },
        ]}
      />
      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory ({products?.length || 0} products)
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {!products || products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found. Add your first product!
              </div>
            ) : (
              <div className="divide-y divide-border">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₩{product.price.toLocaleString()}</p>
                      <Badge
                        variant={product.in_stock ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
