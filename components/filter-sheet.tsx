'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'
import { ShopFilters } from '@/components/shop-filters'

interface FilterSheetProps {
  currentCategory: string
  currentMinPrice: number
  currentMaxPrice: number
}

export default function FilterSheet({ currentCategory, currentMinPrice, currentMaxPrice }: FilterSheetProps) {
  return (
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
  )
}

