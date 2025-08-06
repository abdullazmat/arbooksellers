import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Placeholder product data
const products = [
  {
    id: '1',
    name: 'The Holy Quran (Arabic-English)',
    price: 29.99,
    rating: 4.8,
    reviews: 120,
    image: '/quran-islamic-books.png',
    category: 'Quran',
  },
  {
    id: '2',
    name: 'Sahih Bukhari (Complete Set)',
    price: 89.99,
    rating: 4.9,
    reviews: 85,
    image: '/sahih-bukhari-books.png',
    category: 'Hadith',
  },
  {
    id: '3',
    name: 'Fortress of the Muslim (Duas & Adhkar)',
    price: 9.99,
    rating: 4.7,
    reviews: 200,
    image: '/fortress-muslim-duas-book.png',
    category: 'Duas',
  },
  {
    id: '4',
    name: 'Tafsir Ibn Kathir (Abridged)',
    price: 45.00,
    rating: 4.8,
    reviews: 60,
    image: '/tafsir-ibn-kathir-commentary.png',
    category: 'Tafsir',
  },
  {
    id: '5',
    name: 'Islamic Studies for Kids: Prophets Stories',
    price: 14.99,
    rating: 4.6,
    reviews: 95,
    image: '/islamic-children-book-prophets.png',
    category: 'Kids Books',
  },
  {
    id: '6',
    name: 'The Sealed Nectar (Biography of Prophet Muhammad)',
    price: 24.99,
    rating: 4.9,
    reviews: 150,
    image: '/the-sealed-nectar-book.png',
    category: 'Biography',
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gray-50 font-inter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6 animate-fade-in-down stagger-1">
            Featured Books
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
            Discover our hand-picked selection of the most popular and highly-rated Islamic books.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {products.map((product, index) => (
            <Card key={product.id} className={`overflow-hidden rounded-xl shadow-modern hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up stagger-${index + 3}`}>
              <Link href={`/products/${product.id}`} className="block relative h-60 w-full overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </Link>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  <Link href={`/products/${product.id}`} className="hover:text-islamic-green-600 transition-colors">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-islamic-green-700">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1 text-sm text-islamic-gold-500">
                    <Star className="h-4 w-4 fill-islamic-gold-500" />
                    <span>{product.rating.toFixed(1)} ({product.reviews})</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 gradient-primary hover:shadow-islamic transition-all duration-300 group">
                    <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" className="border-islamic-green-300 text-islamic-green-700 hover:bg-islamic-green-50 hover:border-islamic-green-500 transition-all duration-300 group">
                    <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="sr-only">Add to Wishlist</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up stagger-last">
          <Link href="/products">
            <Button className="h-12 px-8 text-lg rounded-full gradient-primary shadow-islamic hover:shadow-lg transition-all duration-300 hover-lift">
              View All Books
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
