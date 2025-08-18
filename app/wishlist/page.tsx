"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ProductCard,
  ProductCardData,
} from "@/components/products/product-card";

export default function WishlistPage() {
  const { items, isLoading } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductCardData[]>([]);

  // Load full product details for wishlist items to render unified ProductCard
  useEffect(() => {
    const loadDetails = async () => {
      try {
        // Build unique product ids from wishlist items
        const ids = Array.from(
          new Set(
            items.map((item) => {
              if (typeof item.product === "string") return item.product;
              if (
                item.product &&
                typeof item.product === "object" &&
                "_id" in item.product
              ) {
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
              if (!res.ok) {
                return null;
              }
              const data = await res.json();
              return data.product as any;
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

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in to view your wishlist
            </h1>
            <p className="text-gray-600 mb-8">
              You need to be signed in to view and manage your wishlist.
            </p>
            <div className="space-y-3">
              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                asChild
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Browse Books</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Start building your collection of Islamic books by adding items to
              your wishlist!
            </p>
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/products">
                Browse Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? "item" : "items"} saved for
              later
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
