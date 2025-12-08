import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  name: string
  price: number
  image: string
  category: string
}

export function ProductCard({ name, price, image, category }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{category}</p>
          <h3 className="font-medium text-lg mb-2 text-balance">{name}</h3>
          <p className="text-xl font-semibold">${price.toFixed(2)}</p>
        </div>
        <Button className="w-full bg-transparent" variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
