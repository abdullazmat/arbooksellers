'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowDown, BookOpen, Star, Users } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32 bg-gradient-to-br from-islamic-green-50 via-background to-islamic-gold-50 font-inter">
      {/* Background Animated Circles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-islamic-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-80 h-80 bg-islamic-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-islamic-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Arabic Calligraphy Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <span className="font-amiri text-[15vw] text-islamic-green-900 opacity-[0.03] select-none">
          اقرأ
        </span>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content Area */}
          <div className="flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
            <div className="space-y-4 max-w-2xl lg:max-w-none">
              <h1 className="text-responsive-xl font-extrabold leading-tight gradient-text animate-fade-in-left stagger-1">
                Discover Authentic
              </h1>
              <h1 className="text-responsive-xl font-extrabold leading-tight gradient-text animate-fade-in-left stagger-2">
                Islamic Literature
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-left stagger-3">
                Explore a vast collection of Quran, Hadith, Tafsir, and Islamic studies books.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-4 justify-center lg:justify-start">
              <Link href="/products" prefetch={false}>
                <Button className="h-12 px-8 text-lg rounded-full gradient-primary shadow-islamic hover:shadow-lg transition-all duration-300 hover-lift group">
                  Browse Books
                  <BookOpen className="ml-2 h-5 w-5 group-hover:rotate-6 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/about" prefetch={false}>
                <Button variant="outline" className="h-12 px-8 text-lg rounded-full border-2 border-islamic-green-300 text-islamic-green-700 hover:bg-islamic-green-50 hover:border-islamic-green-500 transition-all duration-300 hover-lift group">
                  Learn More
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>

            {/* Floating Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md mx-auto lg:mx-0 pt-8">
              <Card className="glass shadow-modern border border-white/20 animate-fade-in-up stagger-5 hover-lift animate-float" style={{ animationDelay: '0.5s' }}>
                <CardContent className="flex flex-col items-center p-4">
                  <Star className="h-8 w-8 text-islamic-gold-500 mb-2" />
                  <span className="text-2xl font-bold gradient-text">4.9</span>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                </CardContent>
              </Card>
              <Card className="glass shadow-modern border border-white/20 animate-fade-in-up stagger-6 hover-lift animate-float" style={{ animationDelay: '1s' }}>
                <CardContent className="flex flex-col items-center p-4">
                  <BookOpen className="h-8 w-8 text-islamic-green-500 mb-2" />
                  <span className="text-2xl font-bold gradient-text">500+</span>
                  <p className="text-sm text-muted-foreground">Books</p>
                </CardContent>
              </Card>
              <Card className="glass shadow-modern border border-white/20 animate-fade-in-up stagger-7 hover-lift animate-float" style={{ animationDelay: '1.5s' }}>
                <CardContent className="flex flex-col items-center p-4">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold gradient-text">10K+</span>
                  <p className="text-sm text-muted-foreground">Happy Readers</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-right stagger-8">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-modern border border-islamic-green-200 bg-islamic-green-100 animate-float" style={{ animationDelay: '2s' }}>
              <Image
                src="/quran-islamic-books.png"
                alt="Collection of Islamic Books"
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-between animate-fade-in-up stagger-9">
                <span className="text-sm font-semibold text-islamic-green-700">Authentic Islamic Literature</span>
                <span className="px-2 py-1 bg-islamic-gold-100 text-islamic-gold-700 text-xs font-bold rounded-full animate-pulse-glow">
                  New Arrivals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce-y z-30">
        <span className="text-sm text-muted-foreground">Scroll Down</span>
        <ArrowDown className="h-6 w-6 text-islamic-green-600" />
      </div>
    </section>
  )
}
