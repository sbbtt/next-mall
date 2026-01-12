'use client'
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/lib/hooks/useCart"
import { useWishlist } from "@/lib/hooks/useWishlist"
import {Product} from "@/lib/data/products"
import { useState, useEffect } from "react"
import { Skeleton } from "./ui/skeleton"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}
export function ProductCard({ product }: ProductCardProps) {
  const { addItem: addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const {id, name, price, image, category, description} = product;
  const [imgError, setImgError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isWished, setIsWished] = useState(false)
  
  // 클라이언트에서만 찜 상태 확인 (Hydration mismatch 방지)
  useEffect(() => {
    setIsWished(isInWishlist(id))
  }, [id, isInWishlist])
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Link 이동 방지
    e.stopPropagation() // 이벤트 버블링 방지
    addToCart(product)
  }
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(id)
    // Toast는 Hook 내부에서 처리됨
  }
  
  const handleError = () => {
    setImgError(true)
    setIsLoading(false)
  }
  
  return (
    <Link href={`/shop/${id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3 rounded-sm">
        {isLoading && <Skeleton className="absolute inset-0 z-10" />}
        <Image
          src={imgError ? "/placeholder-product.svg" : (image || "/placeholder-product.svg")}
          alt={name}
          fill
          className={`object-cover transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-105'}`}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
        {/* 찜하기 버튼 */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 z-20 h-8 w-8 rounded-full transition-all ${
            isWished 
              ? 'bg-white text-red-500' 
              : 'bg-white/80 hover:bg-white text-gray-600'
          }`}
          onClick={handleToggleWishlist}
          aria-label={isWished ? "찜 해제" : "찜하기"}
        >
          <Heart 
            className={`h-4 w-4 ${isWished ? 'fill-current' : ''}`} 
          />
        </Button>
      </div>
      
      {/* Product Info */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">{category}</div>
        <h3 className="text-sm font-light line-clamp-2 leading-tight">{name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold">{Math.floor(price).toLocaleString()}원</span>
        </div>
      </div>
    </Link>
  )
}
