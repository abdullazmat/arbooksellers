"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Library, Search, Sparkles, ShieldCheck } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ProductCard,
  ProductCardData,
} from "@/components/products/product-card";

export default function WishlistPage() {
  const { items, isLoading, refreshWishlist } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductCardData[]>([]);

  // Refresh wishlist when page loads
  useEffect(() => {
    if (user) {
      refreshWishlist();
    }
  }, [user, refreshWishlist]);

  // Load full product details for wishlist items
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const ids = Array.from(
          new Set(
            items.map((item) => {
              if (typeof item.product === "string") return item.product;
              if (item.product && typeof item.product === "object" && "_id" in item.product) {
                return (item.product as any)._id.toString();
              }
              return String(item.product || "");
            })
          )
        ).filter(Boolean);

        if (ids.length === 0) {
          setProducts([]);
          return;
        }

        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(`/api/products/${id}`);
              if (!res.ok) return null;
              const data = await res.json();
              return data.product;
            } catch (error) {
              return null;
            }
          })
        );

        const detailed = results
          .filter((p): p is any => !!p)
          .map((p) => ({
            _id: p._id,
            title: p.title,
            author: p.author,
            price: p.price,
            originalPrice: p.originalPrice,
            images: p.images || [],
            featured: !!p.featured,
            inStock: !!p.inStock,
            stockQuantity: p.stockQuantity,
            size: p.size,
            pages: p.pages,
            paper: p.paper,
            binding: p.binding,
            rating: p.rating,
            reviews: p.reviews,
            slug: p.slug
          })) as ProductCardData[];

        setProducts(detailed);
      } catch (error) {
        console.error("Error loading product details:", error);
        setProducts([]);
      }
    };

    if (items.length > 0) {
      loadDetails();
    } else {
      setProducts([]);
    }
  }, [items]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
        <Header />
        <main className="flex-grow bg-background flex flex-col items-center justify-center p-4 py-24 relative overflow-hidden">
          {/* Background Aesthetics */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-islamic-green-500/5 rounded-full blur-[100px]" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
          </div>

          <div className="text-center max-w-xl mx-auto relative z-10">
            <div className="w-32 h-32 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none border border-border/50 flex items-center justify-center mx-auto mb-10 transition-transform hover:scale-105 duration-500">
              <Heart className="h-14 w-14 text-islamic-green-600 active:scale-125 transition-transform" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-6 tracking-tighter">Your Library Awaits</h1>
            <p className="text-muted-foreground font-medium mb-12 leading-relaxed text-lg">
              Sign in to view and manage your saved items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-foreground text-background dark:bg-white dark:text-black hover:bg-islamic-green-600 hover:text-white h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all"
                asChild
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button variant="outline" className="h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-border/50 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-background flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-6">
            <div className="relative h-20 w-20 mx-auto">
              <div className="absolute inset-0 border-4 border-islamic-green-600/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-islamic-green-600 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] animate-pulse">Loading Wishlist...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <Header />
      <main className="flex-grow bg-background relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
           <Library className="w-96 h-96" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Header Section */}
          <div className="mb-20 space-y-6">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="w-12 h-[2px] bg-islamic-green-600" />
                     <p className="text-[10px] font-black text-islamic-green-600 uppercase tracking-[0.3em]">Your Wishlist</p>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-none">My <span className="gradient-text">Wishlist</span></h1>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                   <div className="bg-zinc-100 dark:bg-white/5 border border-border/50 rounded-2xl px-6 py-3 flex items-center gap-4">
                      <div className="flex flex-col text-right">
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Items</span>
                         <span className="text-xl font-black text-foreground tracking-tighter">{products.length} Items</span>
                      </div>
                      <div className="w-10 h-10 bg-islamic-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                         <Sparkles className="w-5 h-5" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 bg-zinc-50 dark:bg-white/[0.02] rounded-[3.5rem] border border-dashed border-border/50">
              <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-10 border border-border/50">
                <Search className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h1 className="text-4xl font-black text-foreground mb-4">Your Wishlist is Empty</h1>
              <p className="text-muted-foreground font-medium mb-12 max-w-md mx-auto leading-relaxed">
                You haven't added any items to your wishlist yet. Explore our products and add your favorites.
              </p>
              <Button className="bg-foreground text-background dark:bg-white dark:text-black hover:bg-islamic-green-600 hover:text-white h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl" asChild>
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                {products.map((product) => (
                  <div key={product._id} className="relative group animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="mt-32 p-12 lg:p-20 bg-foreground dark:bg-white rounded-[4rem] text-background dark:text-black relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 lg:p-20 opacity-10 pointer-events-none">
                    <ShieldCheck className="w-64 h-64" />
                 </div>
                 <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight">Securely Managed Wishlist</h2>
                    <p className="text-lg opacity-80 font-inter mb-10 leading-relaxed font-medium">Your wishlist items are saved securely to your account. Ready to check out?</p>
                    <div className="flex flex-col sm:flex-row gap-6">
                       <Button className="h-16 px-12 bg-islamic-green-600 text-white hover:bg-islamic-green-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl" asChild>
                          <Link href="/cart">Go to Cart</Link>
                       </Button>
                       <Button variant="link" className="text-current font-black text-[10px] uppercase tracking-[0.3em] underline underline-offset-8 decoration-2" asChild>
                          <Link href="/products">Explore Further</Link>
                       </Button>
                    </div>
                 </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
