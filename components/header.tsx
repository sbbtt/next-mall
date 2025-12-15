"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCartStore, getTotalItems } from "@/lib/store/useCartStore"

export function Header() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const cartItemCount = useCartStore(getTotalItems)
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchValue.trim())}`)
      setIsSearchOpen(false)
      setSearchValue('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-serif font-semibold tracking-tight">STORE</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/shop" className="text-sm font-medium transition-colors hover:text-accent">
            Shop
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-accent">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-accent">
            Contact
          </Link>
        </nav>

        {/* Search & Cart */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <Input 
                  type="search" 
                  placeholder="Search products..." 
                  className="w-[200px] lg:w-[300px]" 
                  autoFocus 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close search</span>
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
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
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-border p-4 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearch}>
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="w-full" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  )
}
