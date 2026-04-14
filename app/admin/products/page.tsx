"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  Loader2,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatPrice, clearExpiredAdminTokens, getProductImageUrl } from "@/lib/utils";

interface Product {
  _id: string;
  title: string;
  author?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  description?: string;
  images?: string[];
  size?: string;
  pages?: number;
  paper?: string;
  binding?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword: string;
  slug: string;
  reviews?: { name: string; rating: number; content: string }[];
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

interface ProductFormData {
  title: string;
  slug: string;
  author: string;
  price: string;
  originalPrice: string;
  stockQuantity: string;
  description: string;
  images: string[];
  featured: boolean;
  inStock: boolean;
  size: string;
  pages: string;
  paper: string;
  binding: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  reviews: { name: string; rating: number; content: string }[];
  category: string;
  subcategory: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    author: "",
    price: "",
    originalPrice: "",
    stockQuantity: "",
    description: "",
    images: [],
    featured: false,
    inStock: true,
    size: "",
    pages: "",
    paper: "",
    binding: "",
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    reviews: [],
    category: "",
    subcategory: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check token expiration on mount
    if (clearExpiredAdminTokens()) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please login again.",
        variant: "destructive",
      });
      window.location.href = "/admin/login";
      return;
    }

    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Admin token not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      // Check if token is expired
      if (clearExpiredAdminTokens()) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        window.location.href = "/admin/login";
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token is invalid or expired, redirect to login
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          });
          window.location.href = "/admin/login";
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.pagination.pages);
      setTotalProducts(data.pagination.total);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      // Categories fetch failed, continue without them
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      author: "",
      price: "",
      originalPrice: "",
      stockQuantity: "",
      description: "",
      images: [],
      featured: false,
      inStock: true,
      size: "",
      pages: "",
      paper: "",
      binding: "",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      reviews: [],
      category: "",
      subcategory: "",
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug || "",
      author: product.author || "",
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      stockQuantity: product.stockQuantity.toString(),
      description: product.description || "",
      images: product.images || [],
      featured: product.featured,
      inStock: product.inStock,
      size: product.size || "",
      pages: product.pages?.toString() || "",
      paper: product.paper || "",
      binding: product.binding || "",
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      focusKeyword: product.focusKeyword || "",
      reviews: product.reviews || [],
      category: product.category?._id || "",
      subcategory: product.subcategory?._id || "",
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const addReview = () => {
    setFormData({
      ...formData,
      reviews: [...formData.reviews, { name: "", rating: 5, content: "" }],
    });
  };

  const removeReview = (index: number) => {
    const newReviews = [...formData.reviews];
    newReviews.splice(index, 1);
    setFormData({
      ...formData,
      reviews: newReviews,
    });
  };

  const updateReview = (index: number, field: string, value: any) => {
    const newReviews = [...formData.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setFormData({
      ...formData,
      reviews: newReviews,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Product title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.author.trim()) {
      toast({
        title: "Validation Error",
        description: "Product author is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      toast({
        title: "Validation Error",
        description: "Valid price is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.stockQuantity || isNaN(parseInt(formData.stockQuantity))) {
      toast({
        title: "Validation Error",
        description: "Valid stock quantity is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Admin token not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        images: formData.images,
        category: formData.category || undefined,
        subcategory: formData.subcategory || undefined,
      };

      const url = selectedProduct
        ? `/api/admin/products/${selectedProduct._id}`
        : "/api/admin/products";

      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If response is not JSON, get the text content
          const responseText = await response.text();
          console.error("Non-JSON response:", responseText);
          throw new Error(
            `Server error: ${response.status} - ${responseText.substring(
              0,
              200
            )}`
          );
        }
        console.error("API Error:", errorData);
        throw new Error(
          errorData.details || errorData.error || "Failed to save product"
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const responseText = await response.text();
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Server returned invalid response format");
      }

      toast({
        title: "Success",
        description: selectedProduct
          ? "Product updated successfully"
          : "Product created successfully",
      });

      if (selectedProduct) {
        setIsEditDialogOpen(false);
      } else {
        setIsAddDialogOpen(false);
      }

      setSelectedProduct(null);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return formatPrice(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Products</h1>
            <p className="text-muted-foreground font-medium mt-1">Manage your storefront inventory and catalogs</p>
          </div>
          <Button
            className="bg-foreground text-background hover:bg-islamic-green-600 hover:text-white h-14 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all px-8"
            onClick={openAddDialog}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Product
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 pb-6 px-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-islamic-green-500/10 rounded-xl">
                <Filter className="h-5 w-5 text-islamic-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground">Quick Filters</CardTitle>
                <CardDescription className="font-medium">Refine your product view</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-islamic-green-600 h-5 w-5 transition-colors" />
                  <Input
                    placeholder="Search by title, author, or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-zinc-100/50 dark:bg-background border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                   className="h-14 rounded-2xl font-bold px-6 border-border/50 hover:border-islamic-green-500 transition-colors"
                  onClick={() => {
                    setLoading(true);
                    fetchProducts();
                  }}
                  disabled={loading}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 p-8">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-black text-foreground tracking-tight">Product Catalog</CardTitle>
                <CardDescription className="font-medium mt-1">Showing {totalProducts} active products in your store</CardDescription>
              </div>
              <Badge variant="outline" className="h-8 rounded-xl font-bold border-islamic-green-500/30 text-islamic-green-600 bg-islamic-green-500/10 px-4">
                Total: {totalProducts}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-50/50 dark:bg-white/2">
                  <TableRow className="hover:bg-transparent border-border/50 h-16">
                    <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Product</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Specifications</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Classification</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Pricing</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Inventory</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Status</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Added On</TableHead>
                    <TableHead className="text-right px-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} className="border-border/50 hover:bg-zinc-50/50 dark:hover:bg-white/2 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-20 bg-zinc-100 dark:bg-background rounded-2xl flex items-center justify-center overflow-hidden border border-border/50 group shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={getProductImageUrl(product.images[0], "/placeholder.jpg")}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                              />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground/30" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-[240px]">
                            <div className="font-black text-foreground truncate group-hover:text-islamic-green-600 transition-colors">
                              {product.title}
                            </div>
                            <div className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                              by {product.author || "N/A"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest space-y-2">
                           {product.size && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-foreground/40 font-black">Size:</span>{" "}
                              <span className="text-foreground/70">{product.size}</span>
                            </div>
                          )}
                          {product.pages && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-foreground/40 font-black">Pages:</span>{" "}
                              <span className="text-foreground/70">{product.pages}</span>
                            </div>
                          )}
                           {product.binding && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-foreground/40 font-black">Type:</span>{" "}
                              <span className="text-foreground/70">{product.binding}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[11px] font-black uppercase tracking-widest space-y-2.5">
                          {product.category && (
                            <Badge variant="outline" className="bg-zinc-100 dark:bg-white/5 border-none text-[9px] h-6 px-3 rounded-lg text-foreground/70">
                              {product.category.name}
                            </Badge>
                          )}
                          {product.subcategory && (
                            <div className="text-muted-foreground flex items-center gap-1.5 text-[9px]">
                               <ArrowRight className="h-3 w-3" />
                               {product.subcategory.name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-black text-foreground text-lg tracking-tight">
                            {formatCurrency(product.price)}
                          </div>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <div className="text-xs text-muted-foreground font-bold line-through">
                                {formatCurrency(product.originalPrice)}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <div className={`text-sm font-black ${product.stockQuantity < 10 ? 'text-red-500' : 'text-foreground'}`}>
                            {product.stockQuantity} Units
                          </div>
                          <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md inline-block ${product.inStock ? 'bg-islamic-green-500/10 text-islamic-green-600' : 'bg-red-500/10 text-red-600'}`}>
                            {product.inStock ? "Available" : "Stockout"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 scale-90 origin-left">
                          {product.featured && (
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-none font-black text-[9px] uppercase tracking-widest px-3 h-6 rounded-lg">Featured</Badge>
                          )}
                          <Badge
                            className={`border-none font-black text-[9px] uppercase tracking-widest px-3 h-6 rounded-lg ${
                              product.inStock ? "bg-islamic-green-500/10 text-islamic-green-600" : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {product.inStock ? "Live" : "Archived"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          {formatDate(product.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 rounded-xl hover:bg-islamic-green-500/10 hover:text-islamic-green-600 transition-colors"
                            onClick={() => openViewDialog(product)}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 rounded-xl hover:bg-foreground hover:text-background transition-colors"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="h-10 w-10 p-0 rounded-xl text-red-600 hover:text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="p-8 border-t border-border/50 bg-zinc-50/50 dark:bg-white/2">
              {loading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-islamic-green-600"></div>
                  <span className="ml-3 text-xs font-black uppercase tracking-widest text-muted-foreground">Updating product list...</span>
                </div>
              )}
              {totalPages > 1 && !loading && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setLoading(true);
                            setCurrentPage(Math.max(1, currentPage - 1));
                          }
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50 h-10 rounded-xl"
                            : "h-10 rounded-xl bg-background border-border/50 font-bold"
                        }
                      />
                    </PaginationItem>

                    {/* First page */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== 1) {
                              setLoading(true);
                              setCurrentPage(1);
                            }
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
                      const pages = [];
                      const startPage = Math.max(1, currentPage - 2);
                      const endPage = Math.min(totalPages, currentPage + 2);

                      for (
                        let pageNum = startPage;
                        pageNum <= endPage;
                        pageNum++
                      ) {
                        pages.push(pageNum);
                      }

                      return pages.map((pageNum) => (
                        <PaginationItem key={`page-${pageNum}`}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (pageNum !== currentPage) {
                                setLoading(true);
                                setCurrentPage(pageNum);
                              }
                            }}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ));
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
                            e.preventDefault();
                            if (currentPage !== totalPages) {
                              setLoading(true);
                              setCurrentPage(totalPages);
                            }
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
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setLoading(true);
                            setCurrentPage(Math.min(totalPages, currentPage + 1));
                          }
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

              <div className="text-center text-sm text-muted-foreground mt-4">
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>Page {currentPage} of {totalPages} • {products.length} of {totalProducts} products</span>
                )}
              </div>
            </div>
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
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const newSlug = newTitle
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        setFormData({ 
                          ...formData, 
                          title: newTitle,
                          slug: newSlug // Auto-generate slug on title change
                        });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Product Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") 
                        })
                      }
                      placeholder="product-url-slug"
                      required
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 italic">
                      This determines the URL of the product. Keep it short and keyword-rich.
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
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
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) =>
                      setFormData({ ...formData, pages: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paper">Paper</Label>
                  <Input
                    id="paper"
                    value={formData.paper}
                    onChange={(e) =>
                      setFormData({ ...formData, paper: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="binding">Binding</Label>
                  <Input
                    id="binding"
                    value={formData.binding}
                    onChange={(e) =>
                      setFormData({ ...formData, binding: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        category: value,
                        subcategory: "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subcategory: value })
                    }
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category &&
                        categories
                          .find((cat) => cat._id === formData.category)
                          ?.subcategories?.map((subcategory: any) => (
                            <SelectItem
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="images">Images</Label>
                  <ImageUpload
                    images={formData.images}
                    onChange={(newImages: string[]) =>
                      setFormData({ ...formData, images: newImages })
                    }
                    maxImages={5}
                    useCloudUpload={true}
                    isAdmin={true}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-md font-semibold mb-3 text-foreground">SEO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title (Page Title)</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, metaTitle: e.target.value })
                      }
                      placeholder="SEO Page Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="focusKeyword">Focus Keyword</Label>
                    <Input
                      id="focusKeyword"
                      value={formData.focusKeyword}
                      onChange={(e) =>
                        setFormData({ ...formData, focusKeyword: e.target.value })
                      }
                      placeholder="Primary keyword for search ranking"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, metaDescription: e.target.value })
                      }
                      rows={2}
                      placeholder="Brief description for search engines"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-foreground">Custom Reviews</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addReview}>
                    <Plus className="mr-2 h-4 w-4" /> Add Review
                  </Button>
                </div>
                {formData.reviews.map((review, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeReview(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="md:col-span-4">
                      <Label>Reviewer Name</Label>
                      <Input
                        value={review.name}
                        onChange={(e) => updateReview(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Rating (1-5)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={review.rating}
                        onChange={(e) => updateReview(index, "rating", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="md:col-span-6">
                      <Label>Review Content</Label>
                      <Textarea
                        value={review.content}
                        onChange={(e) => updateReview(index, "content", e.target.value)}
                        required
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                {formData.reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">No custom reviews added.</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, inStock: checked })
                    }
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
                    "Create Product"
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
              <DialogDescription>Update product information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setFormData({ ...formData, title: newTitle });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-slug">Product Slug (URL) *</Label>
                    <Input
                      id="edit-slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") 
                        })
                      }
                      placeholder="product-url-slug"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-author">Author</Label>
                  <Input
                    id="edit-author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-originalPrice">
                    Original Price (Rs)
                  </Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="edit-stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-size">Size</Label>
                  <Input
                    id="edit-size"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pages">Pages</Label>
                  <Input
                    id="edit-pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) =>
                      setFormData({ ...formData, pages: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-paper">Paper</Label>
                  <Input
                    id="edit-paper"
                    value={formData.paper}
                    onChange={(e) =>
                      setFormData({ ...formData, paper: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-binding">Binding</Label>
                  <Input
                    id="edit-binding"
                    value={formData.binding}
                    onChange={(e) =>
                      setFormData({ ...formData, binding: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        category: value,
                        subcategory: "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subcategory: value })
                    }
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category &&
                        categories
                          .find((cat) => cat._id === formData.category)
                          ?.subcategories?.map((subcategory: any) => (
                            <SelectItem
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-images">Images</Label>
                  <ImageUpload
                    images={formData.images}
                    onChange={(newImages: string[]) =>
                      setFormData({ ...formData, images: newImages })
                    }
                    maxImages={5}
                    useCloudUpload={true}
                    isAdmin={true}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-md font-semibold mb-3 text-foreground">SEO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-metaTitle">Meta Title (Page Title)</Label>
                    <Input
                      id="edit-metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, metaTitle: e.target.value })
                      }
                      placeholder="SEO Page Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-focusKeywords">Focus Keywords</Label>
                    <Input
                      id="edit-focusKeywords"
                      value={formData.focusKeywords}
                      onChange={(e) =>
                        setFormData({ ...formData, focusKeywords: e.target.value })
                      }
                      placeholder="keyword1, keyword2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="edit-metaDescription">Meta Description</Label>
                    <Textarea
                      id="edit-metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, metaDescription: e.target.value })
                      }
                      rows={2}
                      placeholder="Brief description for search engines"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-foreground">Custom Reviews</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addReview}>
                    <Plus className="mr-2 h-4 w-4" /> Add Review
                  </Button>
                </div>
                {formData.reviews.map((review, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeReview(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="md:col-span-4">
                      <Label>Reviewer Name</Label>
                      <Input
                        value={review.name}
                        onChange={(e) => updateReview(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Rating (1-5)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={review.rating}
                        onChange={(e) => updateReview(index, "rating", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="md:col-span-6">
                      <Label>Review Content</Label>
                      <Textarea
                        value={review.content}
                        onChange={(e) => updateReview(index, "content", e.target.value)}
                        required
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                {formData.reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">No custom reviews added.</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                  <Label htmlFor="edit-featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, inStock: checked })
                    }
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
                    "Update Product"
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
                    <Label className="text-sm font-medium text-muted-foreground">
                      Title
                    </Label>
                    <p className="text-foreground">{selectedProduct.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Slug (URL)
                    </Label>
                    <p className="text-foreground font-mono text-xs">{selectedProduct.slug}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Focus Keyword
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.focusKeyword || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Author
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.author || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Stock Quantity
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.stockQuantity}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Price
                    </Label>
                    <p className="text-foreground">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                  </div>
                  {selectedProduct.originalPrice && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Original Price
                      </Label>
                      <p className="text-foreground line-through">
                        {formatCurrency(selectedProduct.originalPrice)}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Size
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.size || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Pages
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.pages || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Paper
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.paper || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Binding
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.binding || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    <div className="flex items-center space-x-2">
                      {selectedProduct.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      <Badge
                        variant={
                          selectedProduct.inStock ? "default" : "destructive"
                        }
                      >
                        {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedProduct.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Description
                    </Label>
                    <p className="text-foreground">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
                {selectedProduct.images &&
                  selectedProduct.images.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Images
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                        {selectedProduct.images.map((image, index) => (
                          <div key={index} className="image-preview-item">
                            <div className="aspect-square rounded-lg overflow-hidden border border-border/50">
                              <img
                                src={getProductImageUrl(image, "/placeholder.jpg")}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                              />
                            </div>
                            <div className="image-preview-info">
                              <p className="text-center">
                                {image.startsWith("data:")
                                  ? "Uploaded Image"
                                  : "External URL"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Created
                  </Label>
                  <p className="text-foreground">
                    {formatDate(selectedProduct.createdAt)}
                  </p>
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
  );
}
