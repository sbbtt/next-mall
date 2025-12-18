'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { Product } from '@/lib/data/products'
import { toast } from 'sonner'
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
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  const [isWished, setIsWished] = useState(false)
  
  // 클라이언트에서만 찜 상태 확인 (Hydration mismatch 방지)
  useEffect(() => {
    setIsWished(isInWishlist(product.id))
  }, [product.id, isInWishlist])

  const handleToggleWishlist = () => {
    if (isWished) {
      removeItem(product.id)
      setIsWished(false)
      toast.info('찜 목록에서 제거되었습니다', {
        description: `${product.name}`,
        duration: 2000,
      })
    } else {
      addItem(product)
      setIsWished(true)
      toast.success('찜 목록에 추가되었습니다', {
        description: `${product.name}`,
        duration: 2000,
      })
    }
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
