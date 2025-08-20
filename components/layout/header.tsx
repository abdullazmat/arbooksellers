'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import { ShoppingCart, Heart, User, Search, Menu, Home, BookOpen, Info, LayoutDashboard, LogOut, LogIn, UserPlus, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  _id: string
  title: string
  author: string
  price: number
  originalPrice?: number
  images: string[]
  featured: boolean
  inStock: boolean
  discount: number
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const pathname = usePathname()
  const router = useRouter()

  const cartItemCount = cartItems.length
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close search results when route changes
  useEffect(() => {
    setShowSearchResults(false)
    setSearchQuery('')
  }, [pathname])

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=8`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.products || [])
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for search
    if (query.trim()) {
      const timeout = setTimeout(() => {
        performSearch(query)
      }, 300) // 300ms delay to avoid too many requests
      setSearchTimeout(timeout)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchResults(false)
      setSearchQuery('')
    }
  }

  const handleResultClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setShowSearchResults(false)
    setSearchQuery('')
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

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
          <div className="relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-64 pl-10 pr-10 rounded-full bg-gray-100 focus:bg-white focus:border-islamic-green-500 transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              {searchQuery && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-sm text-gray-500 mb-2 px-2">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </div>
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      onClick={() => handleResultClick(result._id)}
                    >
                      <div className="w-12 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {result.images && result.images.length > 0 ? (
                          <img
                            src={result.images[0]}
                            alt={result.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {result.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          by {result.author}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-sm text-islamic-green-600">
                            {formatPrice(result.price)}
                          </span>
                          {result.originalPrice && result.originalPrice > result.price && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(result.originalPrice)}
                            </span>
                          )}
                          {result.discount > 0 && (
                            <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                              -{result.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                      {result.featured && (
                        <div className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
                        setShowSearchResults(false)
                        setSearchQuery('')
                      }}
                    >
                      View All Results
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-green-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Searching...</span>
                </div>
              </div>
            )}

            {/* No Results */}
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                <div className="text-center text-sm text-gray-500">
                  No books found for "{searchQuery}"
                </div>
              </div>
            )}
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
                  <DropdownMenuItem onClick={signOut}>
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
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Input
                      type="search"
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-10 rounded-full bg-gray-100 focus:bg-white focus:border-islamic-green-500 transition-all duration-300"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    {searchQuery && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full"
                        onClick={clearSearch}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </form>

                  {/* Mobile Search Results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-sm text-gray-500 mb-2 px-2">
                          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                        </div>
                        {searchResults.slice(0, 4).map((result) => (
                          <div
                            key={result._id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                            onClick={() => handleResultClick(result._id)}
                          >
                            <div className="w-10 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              {result.images && result.images.length > 0 ? (
                                <img
                                  src={result.images[0]}
                                  alt={result.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.jpg'
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {result.title}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                by {result.author}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-xs text-islamic-green-600">
                                  {formatPrice(result.price)}
                                </span>
                                {result.discount > 0 && (
                                  <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                                    -{result.discount}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {searchResults.length > 4 && (
                          <div className="border-t pt-2 mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
                                setShowSearchResults(false)
                                setSearchQuery('')
                              }}
                            >
                              View All {searchResults.length} Results
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mobile Loading State */}
                  {isSearching && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-islamic-green-600"></div>
                        <span className="ml-2 text-sm text-gray-600">Searching...</span>
                      </div>
                    </div>
                  )}

                  {/* Mobile No Results */}
                  {showSearchResults && searchResults.length === 0 && searchQuery.trim() && !isSearching && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                      <div className="text-center text-sm text-gray-500">
                        No books found for "{searchQuery}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
