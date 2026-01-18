import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const metrics = [
  { label: "Page Views", value: "12,543", change: "+15.3%", trending: "up" },
  { label: "Conversion Rate", value: "3.2%", change: "+0.5%", trending: "up" },
  { label: "Avg. Order Value", value: "$127", change: "-2.1%", trending: "down" },
  { label: "Cart Abandonment", value: "68%", change: "-4.2%", trending: "up" },
]

const topProducts = [
  { name: "Modern Beige Lounge Chair", sales: 45, revenue: 40455 },
  { name: "Minimalist Ceramic Vase Set", sales: 38, revenue: 6042 },
  { name: "Modern Wooden Side Table", sales: 29, revenue: 10121 },
  { name: "Textured Throw Pillow", sales: 67, revenue: 5293 },
]

export default function AnalyticsPage() {
  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Analytics" },
        ]}
      />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your store performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span
                    className={`flex items-center text-xs ${
                      metric.trending === "up" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {metric.trending === "up" ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
