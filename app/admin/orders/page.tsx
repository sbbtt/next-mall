import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  { id: "ORD-001", customer: "John Doe", total: 1248, status: "Completed", date: "2024-01-15" },
  { id: "ORD-002", customer: "Jane Smith", total: 899, status: "Processing", date: "2024-01-14" },
  { id: "ORD-003", customer: "Mike Johnson", total: 349, status: "Shipped", date: "2024-01-14" },
  { id: "ORD-004", customer: "Sarah Wilson", total: 2156, status: "Pending", date: "2024-01-13" },
  { id: "ORD-005", customer: "Tom Brown", total: 79, status: "Completed", date: "2024-01-12" },
]

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Completed: "default",
  Processing: "secondary",
  Shipped: "outline",
  Pending: "destructive",
}

export default function OrdersPage() {
  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Orders" },
        ]}
      />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold">Orders</h1>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <Badge variant={statusColors[order.status]} className="mt-1">
                      {order.status}
                    </Badge>
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
