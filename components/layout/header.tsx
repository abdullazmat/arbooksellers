'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { ShoppingCart, Heart, User, Search, Menu, Home, BookOpen, Info, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const pathname = usePathname()

  const cartItemCount = cartItems.length
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link className="flex items-center" href="/">
          <img src="/logo.png" alt="Islamic Books" className="h-16 w-[80px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-islamic-green-600 transition-colors" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:text-islamic-green-600 transition-colors" href="/products">
            Products
          </Link>
          <Link className="text-sm font-medium hover:text-islamic-green-600 transition-colors" href="/about">
            About Us
          </Link>
        </nav>

        {/* Search and Icons */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Input
              type="search"
              placeholder="Search books..."
              className="w-64 pl-10 rounded-full bg-gray-100 focus:bg-white focus:border-islamic-green-500 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <Link className="relative" href="/wishlist">
            <Button className="rounded-full" size="icon" variant="ghost">
              <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
            </Button>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-bounce-in min-w-[20px] min-h-[20px] border-2 border-white">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          <Link className="relative" href="/cart">
            <Button className="rounded-full" size="icon" variant="ghost">
              <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-islamic-green-600 transition-colors" />
            </Button>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-islamic-green-600 text-xs font-bold text-white animate-bounce-in min-w-[20px] min-h-[20px] border-2 border-white">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Link>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="ghost">
                <User className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Welcome, {user.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signup">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link className="flex items-center gap-3 text-lg font-semibold" href="/">
                  <Home className="h-5 w-5 text-islamic-green-600" />
                  Home
                </Link>
                <Link className="flex items-center gap-3 text-lg font-semibold" href="/products">
                  <BookOpen className="h-5 w-5 text-islamic-green-600" />
                  Products
                </Link>
                <Link className="flex items-center gap-3 text-lg font-semibold" href="/about">
                  <Info className="h-5 w-5 text-islamic-green-600" />
                  About Us
                </Link>
                <div className="relative mt-4">
                  <Input
                    type="search"
                    placeholder="Search books..."
                    className="w-full pl-10 rounded-full bg-gray-100 focus:bg-white focus:border-islamic-green-500 transition-all duration-300"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
