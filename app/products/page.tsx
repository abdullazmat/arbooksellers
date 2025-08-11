'use client'

import { useState, useEffect } from 'react'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductSort } from '@/components/products/product-sort'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Filter, Grid3X3, List } from 'lucide-react'

interface Product {
  _id: string
  title: string
  author?: string
  price: number
  originalPrice?: number
  images: string[]
  inStock: boolean
  featured: boolean
  rating?: number
  reviews?: number
  size?: string
  pages?: number
  paper?: string
  binding?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 10000,
    featured: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, sortBy, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy,
      })

      if (filters.search) {
        params.append('search', filters.search)
      }
      if (filters.featured) {
        params.append('featured', 'true')
      }
      if (filters.minPrice > 0) {
        params.append('minPrice', filters.minPrice.toString())
      }
      if (filters.maxPrice < 10000) {
        params.append('maxPrice', filters.maxPrice.toString())
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      minPrice: 0,
      maxPrice: 10000,
      featured: false,
    })
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to first page when sort changes
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Islamic Books & Literature
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover a comprehensive collection of Islamic books, from Quran and Hadith to Islamic history, 
              jurisprudence, and children's literature in multiple languages.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
            
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <ProductFilters
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <ProductSort value={sortBy} onChange={handleSortChange} />
                
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {products.length} products found
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <CardTitle className="text-xl mb-2">No products found</CardTitle>
                  <CardDescription className="text-center mb-4">
                    Try adjusting your search criteria or filters to find what you're looking for.
                  </CardDescription>
                  <Button onClick={handleResetFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ProductGrid
                products={products}
                viewMode={viewMode}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center px-4">
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
