'use client'
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import {Product} from "@/lib/data/products"
import { useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}
export function ProductCard({ product }: ProductCardProps) {
  const additem = useCartStore(state=>state.addItem)
  const {id, name, price, image, category, description} = product;
  const [imgError, setImgError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Link 이동 방지
    e.stopPropagation() // 이벤트 버블링 방지
    additem(product)
    toast.success('장바구니에 추가되었습니다', {
      description: `${name}`,
      duration: 2000,
    })
  }
  
  const handleError = () => {
    setImgError(true)
    setIsLoading(false)
  }
  
  return (
    <Link href={`/shop/${id}`} className="block">
      <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {isLoading && <Skeleton className="absolute inset-0 z-10" />}
            <Image
              src={imgError ? "/placeholder-product.svg" : (image || "/placeholder-product.svg")}
              alt={name}
              fill
              className={`object-cover transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-105'}`}
              onLoad={() => setIsLoading(false)}
              onError={handleError}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 p-4">
          <div className="w-full space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{category}</p>
            <h3 className="font-medium text-lg line-clamp-2 min-h-[3.5rem]">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{description}</p>
            <p className="text-xl font-semibold">{Math.floor(price).toLocaleString()}원</p>
          </div>
          <Button 
            className="w-full bg-transparent" 
            variant="outline"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
