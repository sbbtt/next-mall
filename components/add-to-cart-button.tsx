'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { Product } from '@/lib/data/products'

interface AddToCartButtonProps {
  product: Product
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function AddToCartButton({ product, size = 'lg', className }: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
  }

  return (
    <Button 
      size={size} 
      className={className} 
      onClick={handleAddToCart}
      disabled={!product.in_stock && product.inStock !== true}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  )
}

