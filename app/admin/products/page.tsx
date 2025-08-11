'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Product {
  _id: string
  title: string
  author: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviews: number
  category: string
  language: string
  inStock: boolean
  stockQuantity: number
  description: string
  featured: boolean
  discountPercentage?: number
  createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    originalPrice: '',
    category: '',
    language: '',
    stockQuantity: '',
    description: '',
    images: '',
    featured: false,
    inStock: true,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('adminToken')
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        images: formData.images.split(',').map(img => img.trim()).filter(img => img),
      }

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct._id}`
        : '/api/admin/products'
      
      const method = editingProduct ? 'PUT' : 'POST'

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
        description: editingProduct ? 'Product updated successfully' : 'Product created successfully',
      })

      setIsAddDialogOpen(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      author: product.author,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      language: product.language,
      stockQuantity: product.stockQuantity.toString(),
      description: product.description,
      images: product.images.join(', '),
      featured: product.featured,
      inStock: product.inStock,
    })
    setIsAddDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      price: '',
      originalPrice: '',
      category: '',
      language: '',
      stockQuantity: '',
      description: '',
      images: '',
      featured: false,
      inStock: true,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProduct(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Update product information' : 'Create a new product'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quran">Quran</SelectItem>
                        <SelectItem value="hadith">Hadith</SelectItem>
                        <SelectItem value="fiqh">Fiqh</SelectItem>
                        <SelectItem value="history">Islamic History</SelectItem>
                        <SelectItem value="children">Children's Books</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Urdu">Urdu</SelectItem>
                        <SelectItem value="Multilingual">Multilingual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="images">Images (comma-separated URLs)</Label>
                    <Input
                      id="images"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
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
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="quran">Quran</SelectItem>
                  <SelectItem value="hadith">Hadith</SelectItem>
                  <SelectItem value="fiqh">Fiqh</SelectItem>
                  <SelectItem value="history">Islamic History</SelectItem>
                  <SelectItem value="children">Children's Books</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchProducts}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images[0] || '/placeholder.jpg'}
                            alt={product.title}
                            className="h-12 w-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-gray-600">{product.author}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(product.price)}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.originalPrice)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{product.stockQuantity}</p>
                          <Badge variant={product.inStock ? "default" : "destructive"}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {product.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                          <Badge variant="outline">{product.language}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">
                          {formatDate(product.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/products/${product._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && products.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 