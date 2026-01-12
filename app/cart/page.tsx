'use client'

import { useCart } from '@/lib/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = () => {
    if (confirm('장바구니를 비우시겠습니까?')) {
      setIsClearing(true)
      clearCart()
      setTimeout(() => setIsClearing(false), 300)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-8">Shopping Cart</h1>
          
          <Card className="p-12 text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6 mt-8" />
            <h2 className="text-2xl font-semibold mb-2">장바구니가 비어있습니다</h2>
            <p className="text-muted-foreground mb-6">
              마음에 드는 상품을 장바구니에 담아보세요
            </p>
            <Button asChild size="lg">
              <Link href="/shop">쇼핑 계속하기</Link>
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold">Shopping Cart</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearCart}
            disabled={isClearing}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            전체 삭제
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/shop/${item.id}`} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link href={`/shop/${item.id}`}>
                          <h3 className="font-semibold hover:text-accent transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold">{Math.floor(item.price * item.quantity).toLocaleString()}원</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(item.price).toLocaleString()}원 (1EA 가격)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">주문 요약</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 개수</span>
                  <span className="font-medium">{items.length}개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">총 수량</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}개
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">소계</span>
                  <span className="font-medium">{Math.floor(totalPrice).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="font-medium text-green-600">무료</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>총 금액</span>
                  <span>{Math.floor(totalPrice).toLocaleString()}원</span>
                </div>
              </div>

              <Button className="w-full mb-3" size="lg">
                주문하기
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/shop">쇼핑 계속하기</Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

