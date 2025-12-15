'use client'

import Link from "next/link"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface MobileMenuProps {
  searchValue: string
  setSearchValue: (value: string) => void
  onSearch: (e: React.FormEvent) => void
}

export default function MobileMenu({ searchValue, setSearchValue, onSearch }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        {/* Mobile Search */}
        <div className="mt-4">
          <form onSubmit={onSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="w-full pl-9" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <nav className="flex flex-col space-y-4 mt-8">
          <Link href="/shop" className="text-lg font-medium transition-colors hover:text-accent">
            Shop
          </Link>
          <Link href="/about" className="text-lg font-medium transition-colors hover:text-accent">
            About
          </Link>
          <Link href="/contact" className="text-lg font-medium transition-colors hover:text-accent">
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

