'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/hooks/useWishlist'
import { Product } from '@/lib/data/products'
import { useState, useEffect } from 'react'

interface AddToWishlistButtonProps {
  product: Product
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
}

export function AddToWishlistButton({ 
  product, 
  size = 'lg', 
  className = '',
  showText = true 
}: AddToWishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [isWished, setIsWished] = useState(false)
  
  // 클라이언트에서만 찜 상태 확인 (Hydration mismatch 방지)
  useEffect(() => {
    setIsWished(isInWishlist(product.id))
  }, [product.id, isInWishlist])

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
  }

  return (
    <Button
      size={size}
      variant={isWished ? "default" : "outline"}
      className={`${className} ${isWished ? 'bg-red-500 hover:bg-red-600' : ''}`}
      onClick={handleToggleWishlist}
    >
      <Heart className={`h-5 w-5 ${showText ? 'mr-2' : ''} ${isWished ? 'fill-current' : ''}`} />
      {showText && (isWished ? '찜 해제' : '찜하기')}
    </Button>
  )
}
