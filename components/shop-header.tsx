'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { SlidersHorizontal, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect, useCallback } from 'react'
import { ShopFilters } from '@/components/shop-filters'

const categories = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'decor', label: 'Decor' },
  { value: 'outdoor', label: 'Outdoor' },
]

interface ShopHeaderProps {
  currentSort: string
  totalProducts: number
  currentSearch: string
  currentCategory: string
  currentMinPrice: number
  currentMaxPrice: number
}

export function ShopHeader({ 
  currentSort, 
  totalProducts, 
  currentSearch,
  currentCategory,
  currentMinPrice,
  currentMaxPrice
}: ShopHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch)

  // ✅ useCallback으로 감싸서 의존성 문제 해결
  const updateUrl = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value && value !== 'default') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    params.delete('page')
    
    startTransition(() => {
      router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
    })
  }, [router, searchParams])

  // ✅ 디바운스: 1초 후 자동 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateUrl('search', searchValue)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchValue, currentSearch, updateUrl]) // ✅ 의존성 완벽

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden shrink-0 h-9 px-3">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ShopFilters
                currentCategory={currentCategory}
                currentMinPrice={currentMinPrice}
                currentMaxPrice={currentMaxPrice}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <input
            type="search"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateUrl('search', searchValue)
              }
            }}
            className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />
        </div>

        {/* Sort */}
        <Select value={currentSort} onValueChange={(value) => updateUrl('sort', value)}>
          <SelectTrigger className="w-[110px] sm:w-[140px] shrink-0 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price ↑</SelectItem>
            <SelectItem value="price-desc">Price ↓</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count & Active Filters */}
      <div className="flex flex-wrap items-center gap-3 pt-4 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
          </span>
        </div>
        
        {/* Active Filter Badges (카테고리, 가격만 표시) */}
        {(currentCategory || currentMinPrice > 0 || currentMaxPrice < 1000000) && (
          <>
            <div className="h-4 w-px bg-border" />
            <div className="flex flex-wrap items-center gap-2">
              {currentCategory && (
                <Badge variant="secondary" className="gap-1 h-6">
                  {categories.find(c => c.value === currentCategory)?.label || currentCategory}
                  <button
                    onClick={() => updateUrl('category', '')}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(currentMinPrice > 0 || currentMaxPrice < 1000000) && (
                <Badge variant="secondary" className="gap-1 h-6">
                  ${currentMinPrice.toLocaleString()} - ${currentMaxPrice.toLocaleString()}
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.delete('minPrice')
                      params.delete('maxPrice')
                      params.delete('page')
                      startTransition(() => {
                        router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
                      })
                    }}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchValue('')
                  startTransition(() => {
                    router.push('/shop')
                  })
                }}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
