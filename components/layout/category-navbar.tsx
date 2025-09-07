'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface Category {
  _id: string
  name: string
  slug: string
  subcategories: Category[]
}

export function CategoryNavbar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      // Error fetching categories
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setScrollPosition(newPosition)
    }
  }

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons)
      checkScrollButtons()
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons)
    }
  }, [categories])

  if (loading) {
    return (
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading categories...</span>
          </div>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 border-b sticky top-16 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Left scroll button */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('left')}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Categories scroll container */}
          <div 
            ref={scrollRef}
            className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <div key={category._id} className="flex-shrink-0">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 whitespace-nowrap"
                      >
                        {category.name}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/products?category=${category._id}`} className="w-full">
                          All {category.name}
                        </Link>
                      </DropdownMenuItem>
                      {category.subcategories.map((subcategory) => (
                        <DropdownMenuItem key={subcategory._id} asChild>
                          <Link href={`/products?category=${subcategory._id}`} className="w-full">
                            {subcategory.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 px-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 whitespace-nowrap"
                  >
                    <Link href={`/products?category=${category._id}`}>
                      {category.name}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('right')}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
