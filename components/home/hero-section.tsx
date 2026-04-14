import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, BookOpen, Star, Users } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-12 pb-16 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 bg-white dark:bg-[#09090b] font-inter">
      {/* Background Animated Circles & Glow */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
        <div
          className="absolute -top-1/4 -left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-islamic-green-300 dark:bg-islamic-green-500 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-islamic-gold-200 dark:bg-islamic-gold-500 rounded-full mix-blend-screen filter blur-[70px] md:blur-[100px] animate-float text-islamic-gold-500"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--islamic-green-500),0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(var(--islamic-green-500),0.15)_0%,transparent_70%)]"></div>
      </div>

      {/* Arabic Calligraphy Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <span className="font-amiri text-[25vw] md:text-[15vw] text-islamic-green-900 opacity-[0.03] select-none">
          اقرأ
        </span>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content Area */}
          <div className="flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left">
            <div className="space-y-4 max-w-2xl lg:max-w-none">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight gradient-text animate-fade-in-left stagger-1">
                Bringing Islamic Literature to Your Doorstep
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black leading-tight text-gray-900 dark:text-gray-100 animate-fade-in-left stagger-2">
                Pakistan's Most Trusted Bookstore Since 2009
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground animate-fade-in-left stagger-3">
                Printed Holy Quran Majeed, Quran with Urdu & English Translation, Paras, Wazaif, and Islamic Products Online in Pakistan.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-4 justify-center lg:justify-start w-full sm:w-auto">
              <Link href="/products" prefetch={false} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full gradient-primary shadow-islamic hover:shadow-lg transition-all duration-300 hover-lift group">
                  Browse Books
                  <BookOpen className="ml-2 h-5 w-5 group-hover:rotate-6 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/about" prefetch={false} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full border-2 border-islamic-green-300 dark:border-islamic-green-500/50 text-islamic-green-700 dark:text-islamic-green-400 hover:bg-islamic-green-50 dark:hover:bg-islamic-green-500/10 transition-all duration-300 hover-lift group"
                >
                  Learn More
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>

            {/* Floating Stat Cards - Compact Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 w-full max-w-lg mx-auto lg:mx-0 pt-4 md:pt-8">
              <Card
                className="glass dark:bg-white/5 shadow-xl border border-white/20 dark:border-white/10 animate-fade-in-up stagger-5 hover-lift animate-float h-full"
                style={{ animationDelay: "0.5s" }}
              >
                <CardContent className="flex flex-col items-center p-4 md:p-6 justify-center text-center">
                  <Star className="h-6 w-6 md:h-8 md:w-8 text-islamic-gold-500 mb-2" />
                  <span className="text-xl md:text-2xl font-black gradient-text">4.9</span>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 text-nowrap">Avg. Rating</p>
                </CardContent>
              </Card>
              <Card
                className="glass shadow-xl border border-white/20 animate-fade-in-up stagger-6 hover-lift animate-float h-full"
                style={{ animationDelay: "1s" }}
              >
                <CardContent className="flex flex-col items-center p-4 md:p-6 justify-center text-center">
                  <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-islamic-green-500 mb-2" />
                  <span className="text-xl md:text-2xl font-black gradient-text">500+</span>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 text-nowrap">Books</p>
                </CardContent>
              </Card>
              <Card
                className="glass shadow-xl border border-white/20 animate-fade-in-up stagger-7 hover-lift animate-float h-full"
                style={{ animationDelay: "1.5s" }}
              >
                <CardContent className="flex flex-col items-center p-4 md:p-6 justify-center text-center">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mb-2" />
                  <span className="text-xl md:text-2xl font-black gradient-text">10K+</span>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 text-nowrap">Happy Readers</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="relative group animate-fade-in-right stagger-2">
            <div className="absolute -inset-4 bg-gradient-to-tr from-islamic-green-600/20 to-islamic-gold-600/20 rounded-[3.5rem] blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="relative rounded-[3rem] overflow-hidden border-4 border-white dark:border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] bg-white dark:bg-zinc-900">
              <Image
                src="/hero-book-rack.png"
                alt="Premium Islamic Book Collection"
                width={800}
                height={1000}
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              
              {/* Image Overlay Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-10">
                <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Badge className="bg-islamic-green-500 hover:bg-islamic-green-600 text-white border-0 py-1.5 px-4 text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Curated Collection
                  </Badge>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    Premium Quality <br/>
                    <span className="text-islamic-gold-400">Authentic Editions</span>
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center rotate-12 animate-float shadow-2xl border-4 border-islamic-gold-400/20">
               <Star className="text-islamic-gold-500 h-14 w-14 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
