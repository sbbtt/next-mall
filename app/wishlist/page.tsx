'use client'

import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useCartStore } from '@/lib/store/useCartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearWishlist = () => {
    if (window.confirm('찜한 상품을 모두 삭제하시겠습니까?')) {
      setIsClearing(true)
      clearWishlist()
      toast.success('찜 목록이 비워졌습니다')
      setTimeout(() => setIsClearing(false), 300)
    }
  }

  const handleRemoveItem = (id: number, name: string) => {
    removeItem(id)
    toast.info('찜 목록에서 제거되었습니다', {
      description: name,
      duration: 2000,
    })
  }

  const handleAddToCart = (product: any) => {
    addToCart(product)
    toast.success('장바구니에 추가되었습니다', {
      description: product.name,
      duration: 2000,
    })
  }

  const handleMoveAllToCart = () => {
    items.forEach((item) => addToCart(item))
    toast.success(`${items.length}개 상품이 장바구니에 추가되었습니다`)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/shop"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">찜한 상품</h1>
          <p className="text-muted-foreground">
            {items.length}개의 상품이 찜 목록에 있습니다
          </p>
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="flex flex-col items-center">
              <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6 mt-8" />
              <h2 className="text-2xl font-semibold mb-2">찜한 상품이 없습니다</h2>
              <p className="text-muted-foreground mb-6">
                마음에 드는 상품을 찾아 하트를 눌러보세요
              </p>
              <Button asChild>
                <Link href="/shop">상품 둘러보기</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleMoveAllToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                전체 장바구니 담기
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleClearWishlist}
                disabled={isClearing}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                전체 삭제
              </Button>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="group overflow-hidden">
                  <CardContent className="p-0">
                    <Link href={`/shop/${item.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Image
                          src={item.image || '/placeholder-product.svg'}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {item.category}
                        </p>
                        <Link href={`/shop/${item.id}`}>
                          <h3 className="font-medium text-lg line-clamp-2 hover:text-accent transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xl font-semibold mt-2">
                          {Math.floor(item.price).toLocaleString()}원
                        </p>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          담기
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

