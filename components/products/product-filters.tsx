'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Search, Filter, X } from 'lucide-react'

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void
  onReset: () => void
}

export function ProductFilters({ onFiltersChange, onReset }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [hasFilters, setHasFilters] = useState(false)

  useEffect(() => {
    const filters = {
      search: searchTerm,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      featured: featuredOnly,
    }
    
    const hasActiveFilters = searchTerm || priceRange[0] > 0 || priceRange[1] < 10000 || featuredOnly
    setHasFilters(hasActiveFilters)
    
    onFiltersChange(filters)
  }, [searchTerm, priceRange, featuredOnly, onFiltersChange])

  const handleReset = () => {
    setSearchTerm('')
    setPriceRange([0, 10000])
    setFeaturedOnly(false)
    onReset()
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(value)
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        <CardDescription>
          Refine your product search
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search by title, author, description, size, paper, or binding..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        {/* Featured Only */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={featuredOnly}
            onChange={(e) => setFeaturedOnly(e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <Label htmlFor="featured">Featured Products Only</Label>
        </div>

        {/* Reset Button */}
        {hasFilters && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
