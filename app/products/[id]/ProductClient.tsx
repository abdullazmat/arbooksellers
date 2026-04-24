"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle,
  Book,
  Maximize2,
  FileText,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  formatPrice,
  getProductImageUrl,
  formatTextWithLineBreaks,
} from "@/lib/utils";
import ProductComments from "@/components/products/product-comments";
import { ProductCard } from "@/components/products/product-card";

interface Product {
  _id: string;
  title: string;
  author?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  description?: string;
  fullDescription?: string;
  size?: string;
  pages?: number;
  paper?: string;
  binding?: string;
  specifications?: Record<string, any>;
  tags?: string[];
  featured: boolean;
  discountPercentage?: number;
  rating?: number;
  reviews?: { name: string; rating: number; content: string }[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
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
  dynamicCommentsCount?: number;
}

export default function ProductClient({
  initialProduct,
  id,
}: {
  initialProduct: Product;
  id: string;
}) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product._id]);

  const fetchRelatedProducts = async () => {
    try {
      setLoadingRelated(true);
      const response = await fetch(
        `/api/products/${product._id}/related?limit=4`,
      );
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch related products", error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product._id,
        title: product.title,
        price: product.price,
        image: getProductImageUrl(product.images[0]),
      },
      quantity,
    );

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
      toast({
        title: "Removed from wishlist",
        description: `${product.title} has been removed from your wishlist`,
      });
    } else {
      await addToWishlist(product._id, {
        title: product.title,
        price: product.price,
        image: getProductImageUrl(product.images[0]),
        author: product.author || "Unknown",
      });
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist`,
      });
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  const toDisplayCase = (value?: string) => {
    if (!value) return "";

    return value
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Breadcrumb - Better for SEO */}
          <nav className="mb-6 sm:mb-12 flex min-w-0 items-center gap-1.5 sm:gap-2 text-[10px] font-black uppercase tracking-[0.12em] sm:tracking-widest text-muted-foreground">
            <Link
              href="/"
              className="shrink-0 hover:text-islamic-green-600 transition-colors"
            >
              Home
            </Link>
            <span className="shrink-0">/</span>
            <Link
              href="/products"
              className="shrink-0 hover:text-islamic-green-600 transition-colors"
            >
              Products
            </Link>
            <span className="shrink-0">/</span>
            <span
              className="min-w-0 flex-1 truncate text-foreground"
              title={product.title}
            >
              {product.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-10 lg:gap-20">
            {/* Left: Image Gallery */}
            <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24 self-start">
              <div className="group relative aspect-square overflow-hidden rounded-[1.75rem] sm:rounded-[2.4rem] lg:rounded-[3rem] bg-white dark:bg-zinc-900 border-2 sm:border-4 border-white dark:border-white/5 shadow-xl sm:shadow-2xl transition-all">
                <img
                  src={getProductImageUrl(product.images[selectedImage])}
                  alt={product.title}
                  className="w-full h-full object-contain p-5 sm:p-6 md:p-8 lg:p-4 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Zoom only on Desktop */}
                <div className="hidden lg:block">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-white/90 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-foreground shadow-2xl hover:bg-islamic-green-600 hover:text-white transition-all scale-0 group-hover:scale-100 duration-300 z-30">
                        <Maximize2 className="h-6 w-6" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="fixed inset-0 w-screen h-screen max-w-none p-0 border-0 bg-black/95 flex items-center justify-center z-[100] outline-none left-0 top-0 translate-x-0 translate-y-0">
                      <div className="sr-only">
                        <DialogTitle>{product.title} - Zoom View</DialogTitle>
                      </div>
                      <div className="relative w-full h-full flex items-center justify-center p-4">
                        <img
                          src={getProductImageUrl(
                            product.images[selectedImage],
                          )}
                          alt={product.title}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto py-2 scrollbar-hide px-1 snap-x snap-mandatory">
                  {product.images.map((image, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-[2rem] border-2 sm:border-4 flex-shrink-0 bg-white dark:bg-zinc-800 flex items-center justify-center transition-all snap-start ${selectedImage === i ? "border-islamic-green-600 scale-105 shadow-xl" : "border-transparent hover:border-muted/50"}`}
                    >
                      <img
                        src={getProductImageUrl(image)}
                        alt=""
                        className="w-full h-full object-contain p-2 sm:p-3 md:p-4"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="space-y-8 sm:space-y-10">
              <div className="space-y-5 sm:space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-islamic-green-500 hover:bg-islamic-green-600 text-white border-0 py-1.5 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {product.category?.name || "Premium Collection"}
                  </Badge>
                  {product.inStock ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 py-1.5 px-4 text-[10px] font-black uppercase tracking-widest"
                    >
                      In Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="py-1.5 px-4 text-[10px] font-black uppercase tracking-widest"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.1]">
                    {product.title}
                  </h1>
                  {product.author && (
                    <p className="text-base sm:text-xl text-muted-foreground font-medium italic">
                      by{" "}
                      <span className="text-islamic-green-600">
                        {product.author.toLowerCase() === "admin"
                          ? "AR Publishers"
                          : product.author}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-end gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Price
                    </span>
                    <span className="text-4xl sm:text-5xl font-black text-islamic-green-600 tracking-tight">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  {discountPercent && (
                    <div className="flex flex-col pb-1">
                      <span className="text-2xl text-muted-foreground line-through font-bold opacity-50">
                        {formatPrice(product.originalPrice!)}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full text-center">
                        Save {discountPercent}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:gap-6 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between bg-zinc-100 dark:bg-white/5 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-border/50 w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 hover:text-islamic-green-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <span className="w-12 text-center font-black text-xl sm:text-2xl">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 hover:text-islamic-green-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-14 sm:h-16 md:h-20 rounded-2xl bg-foreground text-background hover:bg-islamic-green-600 transition-all font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-xs sm:text-sm md:text-base shadow-2xl"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />{" "}
                    Add to Cart
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleWishlistToggle}
                    variant="outline"
                    className={`flex-1 h-14 rounded-2xl border-border transition-all flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest ${isInWishlist(product._id) ? "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-500" : "hover:border-islamic-green-500"}`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isInWishlist(product._id) ? "fill-current" : ""}`}
                    />
                    {isInWishlist(product._id)
                      ? "In Wishlist"
                      : "Add to Wishlist"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info Tabs */}
          <div className="mt-12 md:mt-24">
            <Tabs defaultValue="specifications" className="w-full">
              <div className="w-full border-b border-border">
                <TabsList className="grid grid-cols-3 md:flex md:justify-start h-12 sm:h-14 md:h-16 bg-transparent rounded-none gap-0 md:gap-12 p-0 w-full md:w-auto">
                  <TabsTrigger
                    value="specifications"
                    className="h-full rounded-none border-b-[3px] md:border-b-4 border-transparent data-[state=active]:border-islamic-green-500 bg-transparent text-[11px] sm:text-sm md:text-lg font-black uppercase tracking-[0.08em] sm:tracking-widest px-1 md:px-0"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="description"
                    className="h-full rounded-none border-b-[3px] md:border-b-4 border-transparent data-[state=active]:border-islamic-green-500 bg-transparent text-[11px] sm:text-sm md:text-lg font-black uppercase tracking-[0.08em] sm:tracking-widest px-1 md:px-0"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="h-full rounded-none border-b-[3px] md:border-b-4 border-transparent data-[state=active]:border-islamic-green-500 bg-transparent text-[11px] sm:text-sm md:text-lg font-black uppercase tracking-[0.08em] sm:tracking-widest px-1 md:px-0"
                  >
                    Reviews
                    <span className="ml-1 text-[10px] sm:text-xs md:text-sm">
                      (
                      {(product.reviews?.length || 0) +
                        (product.dynamicCommentsCount || 0)}
                      )
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="specifications" className="pt-7 sm:pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-y-4 sm:gap-x-20 max-w-4xl font-inter">
                  {[
                    {
                      icon: Book,
                      label: "Binding",
                      value: toDisplayCase(product.binding),
                    },
                    { icon: Maximize2, label: "Size", value: product.size },
                    { icon: FileText, label: "Pages", value: product.pages },
                    {
                      icon: CheckCircle,
                      label: "Paper",
                      value: toDisplayCase(product.paper),
                    },
                  ].map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3.5 sm:py-4 border-b border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <spec.icon className="h-4 w-4 sm:h-5 sm:w-5 text-islamic-green-600" />
                        <span className="text-sm font-bold text-muted-foreground">
                          {spec.label}
                        </span>
                      </div>
                      <span className="text-sm font-black text-foreground text-right max-w-[55%] break-words">
                        {spec.value || "Standard"}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="description" className="pt-7 sm:pt-12">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-0 space-y-6">
                    <div
                      className="max-w-4xl text-muted-foreground text-base sm:text-[18px] leading-8 sm:leading-9 [&_p]:mb-5 sm:[&_p]:mb-6 [&_p]:text-base sm:[&_p]:text-[18px] [&_p]:leading-8 sm:[&_p]:leading-9 [&_ul]:my-5 sm:[&_ul]:my-6 [&_ul]:ml-2 [&_ul]:list-disc [&_ul]:pl-6 sm:[&_ul]:pl-7 [&_li]:mb-2.5 sm:[&_li]:mb-3 [&_li]:text-base sm:[&_li]:text-[18px] [&_li]:leading-8 sm:[&_li]:leading-9 [&_li::marker]:text-islamic-green-600 [&_strong]:font-black [&_strong]:text-foreground"
                      dangerouslySetInnerHTML={{
                        __html: formatTextWithLineBreaks(
                          product.description || product.fullDescription,
                        ),
                      }}
                    ></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="pt-7 sm:pt-12">
                <div className="max-w-4xl">
                  <ProductComments
                    productId={product._id}
                    customReviews={product.reviews}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 sm:mt-32 space-y-8 sm:space-y-12">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-4">
                  <Badge className="bg-islamic-gold-500/10 text-islamic-gold-600 border-islamic-gold-200 py-1.5 px-4 text-[10px] font-black uppercase tracking-widest">
                    Recommended
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                    You May Also <span className="gradient-text">Like</span>
                  </h2>
                </div>
                <Link href="/products" className="hidden sm:inline-flex">
                  <Button
                    variant="link"
                    className="text-islamic-green-600 font-black uppercase tracking-widest text-xs group"
                  >
                    View All{" "}
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <div className="sm:hidden pt-1">
                <Link href="/products" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-islamic-green-300 text-islamic-green-700 dark:text-islamic-green-400 font-black uppercase tracking-wider"
                  >
                    View All Products
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
