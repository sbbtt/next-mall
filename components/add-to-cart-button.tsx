'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { Product } from '@/lib/data/products'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: Product
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function AddToCartButton({ product, size = 'lg', className }: AddToCartButtonProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(product)
    toast.success('장바구니에 추가되었습니다', {
      description: `${product.name}`,
      duration: 2000,
    })
  }

  return (
    <Button 
      size={size} 
      className={className} 
      onClick={handleAddToCart}
      disabled={!product.inStock}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  )
}

