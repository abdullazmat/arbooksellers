import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, ChurchIcon as Mosque, Lightbulb, Users } from 'lucide-react'

const categories = [
  {
    name: 'Quran',
    description: 'The Holy Quran in various formats and translations.',
    icon: BookOpen,
    image: '/islamic-calligraphy-quran.png',
    href: '/products?category=quran',
  },
  {
    name: 'Paras',
    description: 'Individual Paras and complete Para sets for daily recitation.',
    icon: BookOpen,
    image: '/placeholder.jpg',
    href: '/products?category=para-individual',
  },
  {
    name: 'Wazaif',
    description: 'Authentic collections of Islamic Duas and Wazaif.',
    icon: Mosque,
    image: '/placeholder.jpg',
    href: '/products?category=wazaif',
  },
  {
    name: 'Qaida & Surah',
    description: 'Essential Qaidas for beginners and individual Surahs.',
    icon: Lightbulb,
    image: '/placeholder.jpg',
    href: '/products?category=qaida-surah',
  },
  {
    name: 'Accessories',
    description: 'Rahals, covers, and other Islamic accessories.',
    icon: Users,
    image: '/placeholder.jpg',
    href: '/products?category=accessories',
  },
]

export default function CategoriesSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-background font-inter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6 animate-fade-in-down stagger-1">
            Explore Our Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
            Find the perfect book by exploring our diverse range of Islamic literature categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {categories.map((category, index) => (
            <Link key={category.name} href={category.href} className={`block animate-fade-in-up stagger-${index + 3}`}>
              <Card className="overflow-hidden rounded-xl shadow-modern hover:shadow-lg transition-all duration-300 hover-lift group">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
                    <category.icon className="h-6 w-6 text-islamic-green-600" />
                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
