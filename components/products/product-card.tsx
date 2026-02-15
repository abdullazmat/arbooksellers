"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";

export interface ProductCardData {
  _id: string;
  title: string;
  author?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  size?: string;
  pages?: number;
  paper?: string;
  binding?: string;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: ProductCardData;
  variant?: 'grid' | 'list';
}

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: getProductImageUrl(product.images?.[0]),
    });

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleWishlistToggle = async () => {
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
        image: getProductImageUrl(product.images?.[0]),
        author: product.author || "Unknown",
      });
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist`,
      });
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (variant === 'list') {
    // Compact horizontal layout for list view
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="w-full sm:w-48 h-48 sm:h-48 flex-shrink-0 relative overflow-hidden bg-gray-100">
              <img
                src={getProductImageUrl(product.images?.[0], '/placeholder.jpg')}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg'
                }}
              />

              {/* Status */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium shadow-md">Featured</Badge>
                )}
                <Badge className={`text-xs font-medium shadow-md ${
                  product.inStock
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 truncate">
                    <Link href={`/products/${product._id}`} className="hover:text-green-600 transition-colors">
                      {product.title}
                    </Link>
                  </h3>
                  {product.author && (
                    <p className="text-sm text-gray-600 mb-2">by {product.author}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Star className={`h-4 w-4 ${product.rating && product.rating > 0 ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    <span>
                      {product.rating && product.rating > 0 ? (
                        <>
                          {Number(product.rating).toFixed(1)} ({product.reviews || 0})
                        </>
                      ) : (
                        'No ratings yet'
                      )}
                    </span>
                  </div>

                  {/* Extra details */}
                  <div className="text-sm text-gray-600 space-x-3 hidden sm:block">
                    {product.size && <span><span className="font-medium">Size:</span> {product.size}</span>}
                    {product.pages && <span><span className="font-medium">Pages:</span> {product.pages}</span>}
                    {product.paper && <span><span className="font-medium">Paper:</span> {product.paper}</span>}
                    {product.binding && <span><span className="font-medium">Binding:</span> {product.binding}</span>}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base sm:text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-9 ${isInWishlist(product._id) ? 'text-red-600 border-red-600' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </Button>

                <Link href={`/products/${product._id}`}>
                  <Button variant="outline" size="sm" className="h-9">View</Button>
                </Link>

                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-green-600 hover:bg-green-700 h-9"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid card layout (default)
  return (
    <Card className="overflow-hidden rounded-xl shadow-modern hover:shadow-lg transition-all duration-300 hover-lift">
      <Link href={`/products/${product._id}`} className="block relative h-60 w-full overflow-hidden">
        <Image
          src={getProductImageUrl(product.images?.[0])}
          alt={product.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

        {/* Status Pills - Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium shadow-md">
              Featured
            </Badge>
          )}
          {product.inStock && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium shadow-md">
              In Stock
            </Badge>
          )}
        </div>

        {/* Discount Badge - Top Right */}
        {discountPercent !== null && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-500 text-white">-{discountPercent}%</Badge>
          </div>
        )}

        {/* Out of Stock Badge - Bottom Left */}
        {!product.inStock && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-gray-500 text-white">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>
      <CardContent className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-foreground truncate">
          <Link href={`/products/${product._id}`} className="hover:text-islamic-green-600 transition-colors">
            {product.title}
          </Link>
        </h3>
        {product.author && (
          <p className="text-sm text-muted-foreground">by {product.author}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-islamic-green-700">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-islamic-gold-500">
            <Star className="h-4 w-4 fill-islamic-gold-500" />
            <span>
              {product.rating && product.rating > 0
                ? `${Number(product.rating).toFixed(1)} (${product.reviews || 0})`
                : "No ratings yet"}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            className="flex-1 gradient-primary hover:shadow-islamic transition-all duration-300 group"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`border-islamic-green-300 text-islamic-green-700 hover:bg-islamic-green-50 hover:border-islamic-green-500 transition-all duration-300 group ${
              isInWishlist(product._id) ? "bg-islamic-green-50 border-islamic-green-500 text-islamic-green-800" : ""
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                isInWishlist(product._id) ? "fill-current text-red-500" : ""
              }`}
            />
            <span className="sr-only">
              {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


