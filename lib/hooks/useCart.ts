'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/contexts/auth-context'
import { products, Product } from '@/lib/data/products'
import { toast } from 'sonner'

export interface CartItem extends Product {
  quantity: number
}

interface CartItemResponse {
  productId: number
  quantity: number
}

// Supabase API 호출 함수들
async function fetchCart(): Promise<CartItemResponse[]> {
  const res = await fetch('/api/cart')
  if (!res.ok) {
    if (res.status === 401) return [] // 로그인 안 됨
    throw new Error('장바구니를 불러올 수 없습니다')
  }
  const data = await res.json()
  return data.cartItems || []
}

async function addToCart(productId: number, quantity = 1): Promise<void> {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || '장바구니 추가 실패')
  }
}

async function updateCartQuantity(productId: number, quantity: number): Promise<void> {
  const res = await fetch('/api/cart', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || '수량 변경 실패')
  }
}

async function removeFromCart(productId: number): Promise<void> {
  const res = await fetch(`/api/cart?productId=${productId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || '장바구니 제거 실패')
  }
}

// React Query Hooks
export function useCart() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // 장바구니 목록 조회
  const { data: cartData = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: fetchCart,
    enabled: !!user, // 로그인 상태일 때만 실행
  })

  // CartItem 객체로 변환
  const items: CartItem[] = cartData
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      return { ...product, quantity: item.quantity }
    })
    .filter((p): p is CartItem => p !== null)

  // 장바구니 추가
  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity?: number }) =>
      addToCart(productId, quantity),
    onMutate: async ({ productId, quantity = 1 }) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['cart', user?.id] })
      const previous = queryClient.getQueryData<CartItemResponse[]>(['cart', user?.id])
      
      queryClient.setQueryData<CartItemResponse[]>(['cart', user?.id], (old = []) => {
        const existing = old.find((item) => item.productId === productId)
        if (existing) {
          return old.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...old, { productId, quantity }]
      })

      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', user?.id], context.previous)
      }
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('장바구니에 추가했습니다')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
  })

  // 수량 변경
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartQuantity(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart', user?.id] })
      const previous = queryClient.getQueryData<CartItemResponse[]>(['cart', user?.id])
      
      queryClient.setQueryData<CartItemResponse[]>(['cart', user?.id], (old = []) => {
        return old.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })

      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', user?.id], context.previous)
      }
      toast.error(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
  })

  // 제거
  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['cart', user?.id] })
      const previous = queryClient.getQueryData<CartItemResponse[]>(['cart', user?.id])
      
      queryClient.setQueryData<CartItemResponse[]>(['cart', user?.id], (old = []) => {
        return old.filter((item) => item.productId !== productId)
      })

      return { previous }
    },
    onError: (err, productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', user?.id], context.previous)
      }
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('장바구니에서 제거했습니다')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
  })

  // 전체 삭제
  const clearCart = async () => {
    if (!user) return
    
    for (const item of cartData) {
      await removeFromCart(item.productId)
    }
    queryClient.invalidateQueries({ queryKey: ['cart', user.id] })
    toast.success('장바구니를 비웠습니다')
  }

  // 총 가격
  const getTotalPrice = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0)

  // 총 아이템 수
  const getTotalItems = () =>
    items.reduce((total, item) => total + item.quantity, 0)

  return {
    items,
    isLoading,
    addItem: (product: Product, quantity = 1) => {
      if (!user) {
        toast.error('로그인이 필요합니다')
        return
      }
      addMutation.mutate({ productId: product.id, quantity })
    },
    updateQuantity: (productId: number, quantity: number) =>
      updateMutation.mutate({ productId, quantity }),
    removeItem: (productId: number) => removeMutation.mutate(productId),
    clearCart,
    getTotalPrice,
    getTotalItems,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
  }
}

