'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock data - in a real app, this would come from an API
const products = [
  {
    id: '1',
    title: 'The Noble Quran - Arabic & English',
    author: 'Translation by Dr. Muhammad Taqi-ud-Din',
    price: 29.99,
    originalPrice: 39.99,
    category: 'quran',
    language: 'Arabic/English',
    inStock: true,
    stock: 150,
    rating: 4.9,
    reviews: 1250,
    image: '/quran-islamic-books.png',
    description: 'Complete Quran with accurate English translation and Arabic text'
  },
  {
    id: '2',
    title: 'Sahih Al-Bukhari Complete Set',
    author: 'Imam Al-Bukhari',
    price: 89.99,
    originalPrice: 120.00,
    category: 'hadith',
    language: 'Arabic/English',
    inStock: true,
    stock: 75,
    rating: 4.8,
    reviews: 890,
    image: '/sahih-bukhari-books.png',
    description: 'The most authentic collection of Prophet Muhammad\'s sayings'
  },
  {
    id: '3',
    title: 'Stories of the Prophets for Children',
    author: 'Ibn Kathir (Adapted)',
    price: 19.99,
    category: 'kids',
    language: 'English',
    inStock: true,
    stock: 200,
    rating: 4.7,
    reviews: 650,
    image: '/islamic-children-book-prophets.png',
    description: 'Engaging stories of prophets adapted for young readers'
  },
  {
    id: '4',
    title: 'The Sealed Nectar - Biography of Prophet',
    author: 'Safi-ur-Rahman al-Mubarakpuri',
    price: 24.99,
    category: 'islamic-studies',
    language: 'English',
    inStock: false,
    stock: 0,
    rating: 4.9,
    reviews: 2100,
    image: '/the-sealed-nectar-book.png',
    description: 'Comprehensive biography of Prophet Muhammad (PBUH)'
  }
]

const categories = [
  { value: 'quran', label: 'Quran & Tafsir' },
  { value: 'hadith', label: 'Hadith Collections' },
  { value: 'islamic-studies', label: 'Islamic Studies' },
  { value: 'kids', label: 'Children Books' },
  { value: 'biography', label: 'Biographies' },
  { value: 'duas', label: 'Duas & Supplications' }
]

const languages = [
  { value: 'english', label: 'English' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'arabic-english', label: 'Arabic/English' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'bengali', label: 'Bengali' }
]

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (inStock: boolean, stock: number) => {
    if (!inStock || stock === 0) return 'bg-red-100 text-red-800'
    if (stock < 10) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (inStock: boolean, stock: number) => {
    if (!inStock || stock === 0) return 'Out of Stock'
    if (stock < 10) return `Low Stock (${stock})`
    return `In Stock (${stock})`
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600">Manage your Islamic book inventory</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add a new Islamic book to your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Book title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" placeholder="Author name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" placeholder="29.99" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input id="originalPrice" type="number" step="0.01" placeholder="39.99" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(language => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" placeholder="/book-image.png" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Book description..." />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
                               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                   <SelectTrigger>
                     <SelectValue placeholder="All Categories" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Categories</SelectItem>
                     {categories.map(category => (
                       <SelectItem key={category.value} value={category.value}>
                         {category.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredProducts.length} products</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.author}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categories.find(c => c.value === product.category)?.label || product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${product.price}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.inStock, product.stock)}>
                        {getStatusText(product.inStock, product.stock)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 