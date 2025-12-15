"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Search, ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCartStore, getTotalItems } from "@/lib/store/useCartStore"

// Dynamic import: 클라이언트에서만 렌더링
const MobileMenu = dynamic(() => import("./mobile-menu"), { ssr: false })

export function Header() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const cartItemCount = useCartStore(getTotalItems)
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchValue.trim())}`)
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
          {/* Desktop Search - Always Visible */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="w-[180px] lg:w-[240px] pl-9 h-9" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>

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

          {/* Mobile Menu - CSR Only */}
          <MobileMenu searchValue={searchValue} setSearchValue={setSearchValue} onSearch={handleSearch} />
        </div>
      </div>
    </header>
  )
}
