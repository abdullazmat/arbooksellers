'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductSort } from '@/components/products/product-sort'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Grid3X3, List, X } from 'lucide-react'

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

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to first page when sort changes
  }, [])

  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-green-600 transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Products</span>
          </nav>
          
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Main Content */}
        <div className="w-full">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
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

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Input */}
              <div className="flex-1 sm:flex-none sm:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFiltersChange({...filters, search: e.target.value})}
                    className="pl-10 pr-8 h-9"
                  />
                  {filters.search && (
                    <button
                      onClick={() => handleFiltersChange({...filters, search: ''})}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Products Count */}
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
                {products.length} products found
              </div>
            </div>
          </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-600">Loading products...</p>
                  <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest collection</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <CardTitle className="text-2xl mb-2 text-center">No products found</CardTitle>
                  <CardDescription className="text-center mb-6 max-w-md">
                    We couldn't find any products matching your current filters. 
                    Try adjusting your search criteria or clearing some filters.
                  </CardDescription>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setFilters({...filters, search: ''})} variant="outline" size="lg">
                      Clear Search
                    </Button>
                  </div>
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
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

      <Footer />
    </>
  )
}
