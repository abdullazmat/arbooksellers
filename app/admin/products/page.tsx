'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ImageUpload } from '@/components/ui/image-upload'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Filter,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import { formatPrice } from '@/lib/utils'

interface Product {
  _id: string
  title: string
  author?: string
  price: number
  originalPrice?: number
  inStock: boolean
  stockQuantity: number
  featured: boolean
  description?: string
  images?: string[]
  size?: string
  pages?: number
  paper?: string
  binding?: string
  createdAt: string
}

interface ProductFormData {
  title: string
  author: string
  price: string
  originalPrice: string
  stockQuantity: string
  description: string
  images: string[]
  featured: boolean
  inStock: boolean
  size: string
  pages: string
  paper: string
  binding: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    author: '',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    description: '',
    images: [],
    featured: false,
    inStock: true,
    size: '',
    pages: '',
    paper: '',
    binding: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      price: '',
      originalPrice: '',
      stockQuantity: '',
      description: '',
      images: [],
      featured: false,
      inStock: true,
      size: '',
      pages: '',
      paper: '',
      binding: '',
    })
  }

  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      title: product.title,
      author: product.author || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stockQuantity: product.stockQuantity.toString(),
      description: product.description || '',
      images: product.images || [],
      featured: product.featured,
      inStock: product.inStock,
      size: product.size || '',
      pages: product.pages?.toString() || '',
      paper: product.paper || '',
      binding: product.binding || '',
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      const token = localStorage.getItem('adminToken')
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        images: formData.images,
      }

      const url = selectedProduct 
        ? `/api/admin/products/${selectedProduct._id}`
        : '/api/admin/products'
      
      const method = selectedProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      const data = await response.json()
      
      toast({
        title: 'Success',
        description: selectedProduct ? 'Product updated successfully' : 'Product created successfully',
      })

      if (selectedProduct) {
        setIsEditDialogOpen(false)
      } else {
        setIsAddDialogOpen(false)
      }
      
      setSelectedProduct(null)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      })

      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return formatPrice(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchProducts}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>
              {products.length} products found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.jpg'
                                }}
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500">by {product.author || 'N/A'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {product.author && <div><span className="font-medium">Author:</span> {product.author}</div>}
                          {product.size && <div><span className="font-medium">Size:</span> {product.size}</div>}
                          {product.pages && <div><span className="font-medium">Pages:</span> {product.pages}</div>}
                          {product.paper && <div><span className="font-medium">Paper:</span> {product.paper}</div>}
                          {product.binding && <div><span className="font-medium">Binding:</span> {product.binding}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{formatCurrency(product.price)}</div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{product.stockQuantity}</div>
                          <div className="text-xs text-gray-500">
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {product.featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                          <Badge variant={product.inStock ? 'default' : 'destructive'}>
                            {product.inStock ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {formatDate(product.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openViewDialog(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(1)
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis */}
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Page numbers around current page */}
                    {(() => {
                      const pages = []
                      const startPage = Math.max(1, currentPage - 2)
                      const endPage = Math.min(totalPages, currentPage + 2)
                      
                      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                        pages.push(pageNum)
                      }
                      
                      return pages.map((pageNum) => (
                        <PaginationItem key={`page-${pageNum}`}>
                          <PaginationLink 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(pageNum)
                            }}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    })()}
                    
                    {/* Ellipsis */}
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(totalPages)
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center text-sm text-gray-600 mt-4">
                  Page {currentPage} of {totalPages} • {products.length} products per page
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product for your catalog
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (Rs) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (Rs)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="paper">Paper</Label>
                  <Input
                    id="paper"
                    value={formData.paper}
                    onChange={(e) => setFormData({ ...formData, paper: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="binding">Binding</Label>
                  <Input
                    id="binding"
                    value={formData.binding}
                    onChange={(e) => setFormData({ ...formData, binding: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="images">Images</Label>
                  <ImageUpload
                    images={formData.images}
                    onChange={(newImages: string[]) => setFormData({ ...formData, images: newImages })}
                    maxImages={5}
                    useCloudUpload={true}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update product information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-author">Author</Label>
                  <Input
                    id="edit-author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price (Rs) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-originalPrice">Original Price (Rs)</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="edit-stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-size">Size</Label>
                  <Input
                    id="edit-size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pages">Pages</Label>
                  <Input
                    id="edit-pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-paper">Paper</Label>
                  <Input
                    id="edit-paper"
                    value={formData.paper}
                    onChange={(e) => setFormData({ ...formData, paper: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-binding">Binding</Label>
                  <Input
                    id="edit-binding"
                    value={formData.binding}
                    onChange={(e) => setFormData({ ...formData, binding: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-images">Images</Label>
                  <ImageUpload
                    images={formData.images}
                    onChange={(newImages: string[]) => setFormData({ ...formData, images: newImages })}
                    maxImages={5}
                    useCloudUpload={true}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="edit-featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                  />
                  <Label htmlFor="edit-inStock">In Stock</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Product'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Product Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
              <DialogDescription>
                View complete product information
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Title</Label>
                    <p className="text-gray-900">{selectedProduct.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Author</Label>
                    <p className="text-gray-900">{selectedProduct.author || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Stock Quantity</Label>
                    <p className="text-gray-900">{selectedProduct.stockQuantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Price</Label>
                    <p className="text-gray-900">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  {selectedProduct.originalPrice && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Original Price</Label>
                      <p className="text-gray-900 line-through">{formatCurrency(selectedProduct.originalPrice)}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Size</Label>
                    <p className="text-gray-900">{selectedProduct.size || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Pages</Label>
                    <p className="text-gray-900">{selectedProduct.pages || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Paper</Label>
                    <p className="text-gray-900">{selectedProduct.paper || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Binding</Label>
                    <p className="text-gray-900">{selectedProduct.binding || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="flex items-center space-x-2">
                      {selectedProduct.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      <Badge variant={selectedProduct.inStock ? 'default' : 'destructive'}>
                        {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedProduct.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-gray-900">{selectedProduct.description}</p>
                  </div>
                )}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                      {selectedProduct.images.map((image, index) => (
                        <div key={index} className="image-preview-item">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={image} 
                              alt={`Product ${index + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg'
                              }}
                            />
                          </div>
                          <div className="image-preview-info">
                            <p className="text-center">
                              {image.startsWith('data:') ? 'Uploaded Image' : 'External URL'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="text-gray-900">{formatDate(selectedProduct.createdAt)}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
} 