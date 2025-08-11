'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, X } from 'lucide-react'
import React from 'react'

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void
  onReset: () => void
}

export function ProductFilters({ onFiltersChange, onReset }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [hasFilters, setHasFilters] = useState(false)
  const isMounted = React.useRef(true)

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Memoize the filters object to prevent unnecessary re-renders
  const filters = useCallback(() => ({
    search: searchTerm,
    minPrice: 0,
    maxPrice: 10000,
    featured: false,
  }), [searchTerm])

  // Memoize the hasActiveFilters calculation
  const hasActiveFilters = useCallback(() => {
    return Boolean(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    if (!isMounted.current) return
    
    const currentFilters = filters()
    const currentHasFilters = hasActiveFilters()
    
    setHasFilters(currentHasFilters)
    
    // Debounce the filter change to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        onFiltersChange(currentFilters)
      }
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [filters, hasActiveFilters, onFiltersChange])

  const handleReset = () => {
    setSearchTerm('')
    onReset()
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5" />
          Search Products
        </CardTitle>
        <CardDescription>
          Find Islamic books by title, author, description, size, paper, or binding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">Search Products</Label>
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

        {/* Reset Button */}
        {hasFilters && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              size="sm"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
