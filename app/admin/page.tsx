import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react"
import { products } from "@/lib/data/products"

export default function AdminDashboard() {
  const totalProducts = products.length
  const inStockProducts = products.filter(p => p.inStock !== false).length
  
  const stats = [
    { label: "Total Revenue", value: "집계 중", change: "", icon: DollarSign },
    { label: "Orders", value: "집계 중", change: "", icon: ShoppingCart },
    { label: "Products", value: totalProducts.toString(), change: `${inStockProducts} in stock`, icon: Package },
    { label: "Customers", value: "집계 중", change: "", icon: Users },
  ]

  return (
    <>
      <AdminHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <main className="p-6">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && <p className="text-xs text-muted-foreground">{stat.change}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
