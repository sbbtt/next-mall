'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X, RotateCcw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface ShopFiltersProps {
  currentCategory: string
  currentMinPrice: number
  currentMaxPrice: number
}

const categories = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'decor', label: 'Decor' },
  { value: 'outdoor', label: 'Outdoor' },
]

export function ShopFilters({ currentCategory, currentMinPrice, currentMaxPrice }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [priceRange, setPriceRange] = useState([currentMinPrice, currentMaxPrice])

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '0' && value !== '700000') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // 페이지 초기화
    params.delete('page')
    
    startTransition(() => {
      router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
    })
  }

  const handleCategoryChange = (category: string) => {
    updateUrl({ category: currentCategory === category ? null : category })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  const applyPriceFilter = () => {
    updateUrl({
      minPrice: String(priceRange[0]),
      maxPrice: String(priceRange[1])
    })
  }

  const clearFilters = () => {
    setPriceRange([0, 700000])
    startTransition(() => {
      router.push('/shop')
    })
  }

  const hasActiveFilters = currentCategory || currentMinPrice > 0 || currentMaxPrice < 700000

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.value === currentCategory)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCategoryChange(currentCategory)}
              />
            </Badge>
          )}
          {(currentMinPrice > 0 || currentMaxPrice < 700000) && (
            <Badge variant="secondary" className="gap-1">
              ${Math.floor(currentMinPrice).toLocaleString()} - ${Math.floor(currentMaxPrice).toLocaleString()}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateUrl({ minPrice: null, maxPrice: null })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Category Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.value} className="flex items-center space-x-2">
              <Checkbox
                id={cat.value}
                checked={currentCategory === cat.value}
                onCheckedChange={() => handleCategoryChange(cat.value)}
              />
              <Label
                htmlFor={cat.value}
                className="text-sm font-normal cursor-pointer"
              >
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm">Price Range</h4>
        <div className="space-y-3">
          <Slider
            min={0}
            max={700000}
            step={10000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${Math.floor(priceRange[0]).toLocaleString()}</span>
            <span>${Math.floor(priceRange[1]).toLocaleString()}</span>
          </div>
          {(priceRange[0] !== currentMinPrice || priceRange[1] !== currentMaxPrice) && (
            <Button 
              size="sm" 
              className="w-full" 
              onClick={applyPriceFilter}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

