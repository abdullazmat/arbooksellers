"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    return (
      <Card className="group overflow-hidden bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500 rounded-3xl">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image Container */}
            <div className="w-full sm:w-64 aspect-[3/4] sm:aspect-square flex-shrink-0 relative overflow-hidden bg-gray-50">
              <Image
                src={getProductImageUrl(product.images?.[0], '/placeholder.jpg')}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <Badge className="bg-islamic-gold-500 text-white border-0 py-1 px-3 text-[10px] font-black uppercase tracking-tighter">Featured</Badge>
                )}
                {!product.inStock && (
                  <Badge className="bg-gray-900 text-white border-0 py-1 px-3 text-[10px] font-black uppercase tracking-tighter">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                      <Link href={`/products/${product._id}`} className="hover:text-islamic-green-600 transition-colors">
                        {product.title}
                      </Link>
                    </h3>
                    {product.author && (
                      <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">by {product.author}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-islamic-green-700">{formatPrice(product.price)}</span>
                    {discountPercent && (
                      <span className="text-sm text-gray-400 line-through font-medium">{formatPrice(product.originalPrice!)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-islamic-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (product.rating || 0) ? 'fill-current' : 'opacity-20'}`} />
                  ))}
                  <span className="text-xs font-bold text-gray-400 ml-2">({product.reviews || 0} Reviews)</span>
                </div>

                <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-gray-50 transition-colors group-hover:border-gray-100">
                  {product.binding && <p><span className="font-black text-gray-400 uppercase text-[10px] tracking-widest mr-2">Binding:</span> {product.binding}</p>}
                  {product.pages && <p><span className="font-black text-gray-400 uppercase text-[10px] tracking-widest mr-2">Pages:</span> {product.pages}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 h-14 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-xl hover:shadow-islamic-green-100"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-14 rounded-2xl border-gray-100 hover:border-islamic-green-500 transition-all ${isInWishlist(product._id) ? 'bg-islamic-green-50 border-islamic-green-500 text-red-500' : 'text-gray-400'}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid Card Redesign
  return (
    <Card className="group relative bg-white border-0 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-islamic-green-100/20 transition-all duration-500 rounded-[2rem] overflow-hidden hover:-translate-y-2">
      {/* Image Area */}
      <Link href={`/products/${product._id}`} className="block relative aspect-[4/5] overflow-hidden bg-white">
        <Image
          src={getProductImageUrl(product.images?.[0])}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-islamic-gold-500 text-white border-0 py-1.5 px-4 text-[9px] font-black uppercase tracking-widest shadow-xl">Featured</Badge>
          )}
          {discountPercent && (
            <Badge className="bg-red-500 text-white border-0 py-1.5 px-4 text-[9px] font-black uppercase tracking-widest shadow-xl">-{discountPercent}%</Badge>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="bg-gray-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Out of Stock</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute bottom-6 left-6 right-6 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 md:block hidden">
          <Button 
            className="w-full bg-white text-gray-900 hover:bg-islamic-green-600 hover:text-white rounded-full font-black text-xs uppercase tracking-widest h-12 shadow-2xl transition-colors"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            Quick Add
          </Button>
        </div>
      </Link>

      {/* Content Area */}
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1">
          <Link href={`/products/${product._id}`} className="block group/title">
            <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-2 min-h-[3rem] group-hover/title:text-islamic-green-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          {product.author && (
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest truncate">by {product.author}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-islamic-green-700 tracking-tight">{formatPrice(product.price)}</span>
            {discountPercent && (
              <span className="text-sm text-gray-300 line-through font-bold">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleWishlistToggle}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isInWishlist(product._id) 
                ? 'bg-red-50 text-red-500 scale-110 shadow-lg' 
                : 'bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-islamic-green-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
