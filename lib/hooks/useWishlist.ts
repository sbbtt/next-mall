'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/contexts/auth-context'
import { products, Product } from '@/lib/data/products'
import { toast } from 'sonner'

// Supabase API 호출 함수들
async function fetchWishlist(): Promise<number[]> {
  const res = await fetch('/api/wishlist')
  if (!res.ok) {
    if (res.status === 401) return [] // 로그인 안 됨
    throw new Error('찜하기 목록을 불러올 수 없습니다')
  }
  const data = await res.json()
  return data.productIds || []
}

async function addToWishlist(productId: number): Promise<void> {
  const res = await fetch('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || '찜하기 추가 실패')
  }
}

async function removeFromWishlist(productId: number): Promise<void> {
  const res = await fetch(`/api/wishlist?productId=${productId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || '찜하기 제거 실패')
  }
}

// React Query Hooks
export function useWishlist() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // 찜하기 목록 조회
  const { data: productIds = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: fetchWishlist,
    enabled: !!user, // 로그인 상태일 때만 실행
  })

  // Product 객체로 변환
  const items: Product[] = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined)

  // 찜하기 추가
  const addMutation = useMutation({
    mutationFn: addToWishlist,
    onMutate: async (productId) => {
      // Optimistic Update: UI 즉시 반영
      await queryClient.cancelQueries({ queryKey: ['wishlist', user?.id] })
      const previous = queryClient.getQueryData<number[]>(['wishlist', user?.id])
      
      queryClient.setQueryData<number[]>(['wishlist', user?.id], (old = []) => {
        return old.includes(productId) ? old : [...old, productId]
      })

      return { previous }
    },
    onError: (err, productId, context) => {
      // 실패 시 롤백
      if (context?.previous) {
        queryClient.setQueryData(['wishlist', user?.id], context.previous)
      }
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('찜하기에 추가했습니다')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })

  // 찜하기 제거
  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onMutate: async (productId) => {
      // Optimistic Update: UI 즉시 반영
      await queryClient.cancelQueries({ queryKey: ['wishlist', user?.id] })
      const previous = queryClient.getQueryData<number[]>(['wishlist', user?.id])
      
      queryClient.setQueryData<number[]>(['wishlist', user?.id], (old = []) => {
        return old.filter((id) => id !== productId)
      })

      return { previous }
    },
    onError: (err, productId, context) => {
      // 실패 시 롤백
      if (context?.previous) {
        queryClient.setQueryData(['wishlist', user?.id], context.previous)
      }
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('찜하기에서 제거했습니다')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })

  // 토글 함수
  const toggleWishlist = (productId: number) => {
    if (!user) {
      toast.error('로그인이 필요합니다')
      return
    }

    if (productIds.includes(productId)) {
      removeMutation.mutate(productId)
    } else {
      addMutation.mutate(productId)
    }
  }

  // 찜 여부 확인
  const isInWishlist = (productId: number) => productIds.includes(productId)

  // 전체 삭제
  const clearWishlist = async () => {
    if (!user) return
    
    for (const productId of productIds) {
      await removeFromWishlist(productId)
    }
    queryClient.invalidateQueries({ queryKey: ['wishlist', user.id] })
    toast.success('찜하기 목록을 모두 삭제했습니다')
  }

  return {
    items,
    productIds,
    isLoading,
    addItem: (productId: number) => addMutation.mutate(productId),
    removeItem: (productId: number) => removeMutation.mutate(productId),
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    totalItems: items.length,
  }
}

