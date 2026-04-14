"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductSort } from "@/components/products/product-sort";
import { ProductSidebar } from "@/components/products/product-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  author?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
  size?: string;
  pages?: number;
  paper?: string;
  binding?: string;
  rating?: number;
  reviews?: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    featured: false,
    category: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Initialize filters from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const categoryQuery = searchParams.get("category");

    if (searchQuery || categoryQuery) {
      setFilters((prev) => ({
        ...prev,
        search: searchQuery || prev.search,
        category: categoryQuery ? categoryQuery.split(",") : "all",
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "8",
        sort: sortBy,
      });

      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.featured) {
        params.append("featured", "true");
      }
      if (filters.minPrice > 0) {
        params.append("minPrice", filters.minPrice.toString());
      }
      if (filters.maxPrice < 10000) {
        params.append("maxPrice", filters.maxPrice.toString());
      }
      if (filters.category && filters.category !== "all") {
        if (Array.isArray(filters.category)) {
          params.append("category", filters.category.join(","));
        } else {
          params.append("category", filters.category);
        }
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.pagination.pages);
      setTotalProducts(data.pagination.total);
    } catch (error) {
      // Error fetching products
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = useCallback(
    (newFilters: any) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change

      // Update URL parameters
      const params = new URLSearchParams(searchParams.toString());

      // Update search parameter
      if (newFilters.search) {
        params.set("search", newFilters.search);
      } else {
        params.delete("search");
      }

      // Update category parameter
      if (newFilters.category && newFilters.category !== "all") {
        if (Array.isArray(newFilters.category)) {
          params.set("category", newFilters.category.join(","));
        } else {
          params.set("category", newFilters.category);
        }
      } else {
        params.delete("category");
      }

      // Update URL
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.push(newUrl);
    },
    [searchParams, pathname, router]
  );

  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sort changes
  }, []);

  const clearSearch = () => {
    const newFilters = { ...filters, search: "" };
    handleFiltersChange(newFilters);
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-islamic-green-600 transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-foreground font-medium">Products</span>
          </nav>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">
              Islamic Books & Literature
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our collection includes the Holy Quran, Hadith books, Islamic history, fiqh and children’s Islamic books.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filter Sidebar (Desktop & Mobile drawer inside) */}
          <ProductSidebar filters={filters} onChange={handleFiltersChange} />
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <ProductSort value={sortBy} onChange={handleSortChange} />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Input */}
              <div className="flex-1 sm:flex-none sm:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFiltersChange({
                        ...filters,
                        search: e.target.value,
                      })
                    }
                    className="pl-10 pr-8 h-9"
                  />
                  {filters.search && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Products Count */}
              <div className="text-sm text-muted-foreground bg-accent/50 px-3 py-2 rounded-lg whitespace-nowrap min-w-[120px] text-center">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-12 h-4 bg-gray-300 dark:bg-zinc-700 animate-pulse rounded"></span>
                    <span className="ml-2">found</span>
                  </span>
                ) : (
                  <>{totalProducts} products found</>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64 bg-accent/20 rounded-[2rem]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600 mx-auto mb-4"></div>
                <p className="text-lg text-foreground">Loading products...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please wait while we fetch the latest collection
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <Card className="border-2 border-dashed border-border py-12 bg-transparent rounded-[2.5rem]">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-accent/50 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2 text-center">
                  No products found
                </CardTitle>
                <CardDescription className="text-center mb-6 max-w-md">
                  We couldn't find any products matching your current filters.
                  Try adjusting your search criteria or clearing some filters.
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    variant="outline"
                    size="lg"
                  >
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ProductGrid products={products} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={loading || currentPage === 1}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>

                <div className="flex items-center px-4 py-2 bg-accent/50 rounded-lg min-w-[120px] justify-center">
                  {loading ? (
                    <div className="w-20 h-4 bg-gray-300 dark:bg-zinc-700 animate-pulse rounded"></div>
                  ) : (
                    <span className="text-sm text-foreground font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={loading || currentPage === totalPages}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>

      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <Header />
    }>
      <ProductsContent />
    </Suspense>
  );
}
