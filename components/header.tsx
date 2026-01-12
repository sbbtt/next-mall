"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Search, ShoppingCart, Heart, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/hooks/useCart"
import { useWishlist } from "@/lib/hooks/useWishlist"
import { useAuth } from "@/lib/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dynamic import: 클라이언트에서만 렌더링
const MobileMenu = dynamic(() => import("./mobile-menu"), { ssr: false })

export function Header() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const { totalItems: cartItemCount } = useCart()
  const { totalItems: wishlistItemCount } = useWishlist()
  const { user, signInWithGoogle, signOut } = useAuth()
  
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
          <div className="text-2xl font-serif font-semibold tracking-tight">Apple Furniture</div>
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

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {wishlistItemCount}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
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

          {/* User Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="font-medium">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => signInWithGoogle()}
            >
              로그인
            </Button>
          )}

          {/* Mobile Menu - CSR Only */}
          <MobileMenu searchValue={searchValue} setSearchValue={setSearchValue} onSearch={handleSearch} />
        </div>
      </div>
    </header>
  )
}
