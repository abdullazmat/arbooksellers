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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Edit, Trash2, Eye, FileText, Image, Star, Calendar, User } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock data - in a real app, this would come from an API
const testimonials = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    role: 'Customer',
    avatar: '/ahmed-hassan-profile.png',
    rating: 5,
    content: 'Excellent service and authentic Islamic books. The Quran translation is very accurate and the delivery was prompt.',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    role: 'Customer',
    avatar: '/fatima-ali-profile.png',
    rating: 5,
    content: 'My children love the Islamic stories books. The illustrations are beautiful and the content is age-appropriate.',
    isActive: true,
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Omar Abdullah',
    role: 'Customer',
    avatar: '/omar-khan-profile.png',
    rating: 4,
    content: 'Great collection of hadith books. The Sahih Al-Bukhari set is well-translated and easy to understand.',
    isActive: false,
    createdAt: '2024-01-13T12:20:00Z'
  }
]

const banners = [
  {
    id: '1',
    title: 'Ramadan Special Collection',
    subtitle: 'Discover our curated selection of Islamic books for the holy month',
    image: '/ramadan-banner.jpg',
    link: '/products?category=ramadan',
    isActive: true,
    position: 'hero',
    startDate: '2024-03-10T00:00:00Z',
    endDate: '2024-04-10T23:59:59Z',
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Latest Islamic books and publications',
    image: '/new-arrivals-banner.jpg',
    link: '/products?sort=newest',
    isActive: true,
    position: 'secondary',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

const blogPosts = [
  {
    id: '1',
    title: 'The Importance of Reading Islamic Literature',
    excerpt: 'Discover why reading Islamic books is essential for spiritual growth and knowledge...',
    content: 'Full blog post content here...',
    author: 'Admin User',
    status: 'published',
    featuredImage: '/blog-islamic-literature.jpg',
    tags: ['islamic-education', 'spiritual-growth'],
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '2',
    title: 'Choosing the Right Quran Translation',
    excerpt: 'A guide to selecting the most suitable Quran translation for your needs...',
    content: 'Full blog post content here...',
    author: 'Admin User',
    status: 'draft',
    featuredImage: '/blog-quran-translation.jpg',
    tags: ['quran', 'translation', 'guidance'],
    publishedAt: null,
    createdAt: '2024-01-12T16:45:00Z'
  }
]

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('testimonials')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">Manage website content, testimonials, banners, and blog posts</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Testimonial</DialogTitle>
                    <DialogDescription>
                      Add a customer testimonial to display on the website
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Customer Name</Label>
                        <Input id="name" placeholder="Customer name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role/Title</Label>
                        <Input id="role" placeholder="e.g., Customer, Student" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Testimonial Content</Label>
                      <Textarea id="content" placeholder="Customer testimonial..." rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input id="avatar" placeholder="/customer-avatar.jpg" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="isActive" />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Testimonial</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{testimonial.name}</div>
                              <div className="text-sm text-gray-500">{testimonial.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm line-clamp-2">{testimonial.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {testimonial.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(testimonial.createdAt)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
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
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Banner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Banner</DialogTitle>
                    <DialogDescription>
                      Create a new banner for the website
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Banner Title</Label>
                      <Input id="title" placeholder="Banner title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input id="subtitle" placeholder="Banner subtitle" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" placeholder="/banner-image.jpg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link">Link URL</Label>
                      <Input id="link" placeholder="/products?category=special" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hero">Hero Section</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="sidebar">Sidebar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="isActive">Active Status</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="isActive" />
                          <Label htmlFor="isActive">Active</Label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="datetime-local" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="datetime-local" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Banner</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Banners</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={banner.image || "/placeholder.svg"}
                              alt={banner.title}
                              className="h-12 w-20 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{banner.title}</div>
                              <div className="text-sm text-gray-500">{banner.subtitle}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{banner.position}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(banner.startDate)} - {formatDate(banner.endDate)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
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
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add New Blog Post</DialogTitle>
                    <DialogDescription>
                      Create a new blog post for the website
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Post Title</Label>
                      <Input id="title" placeholder="Blog post title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea id="excerpt" placeholder="Brief description..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" placeholder="Full blog post content..." rows={10} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="featuredImage">Featured Image URL</Label>
                        <Input id="featuredImage" placeholder="/blog-image.jpg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" placeholder="islamic-education, spiritual-growth" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="isPublished" />
                      <Label htmlFor="isPublished">Publish immediately</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Publish Post</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Post</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.featuredImage || "/placeholder.svg"}
                              alt={post.title}
                              className="h-12 w-16 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{post.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{post.author}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
} 