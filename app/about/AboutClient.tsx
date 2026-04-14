"use client";

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Scroll, Globe, Crown } from 'lucide-react'
import Image from 'next/image'

const values = [
  {
    icon: ShieldCheck,
    title: 'Genuine Books Only',
    description: 'Every book is carefully checked for quality and accuracy before we send it to you.'
  },
  {
    icon: Scroll,
    title: 'Trusted Publishers',
    description: 'We work directly with well-known Islamic publishers and scholars to bring you the best.'
  },
  {
    icon: Crown,
    title: 'Great Quality',
    description: 'We use high-quality printing, strong bindings, and beautiful packaging for every order.'
  },
  {
    icon: Globe,
    title: 'Delivery Across Pakistan',
    description: 'We deliver to every city in Pakistan with tracking and friendly customer support.'
  }
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900 overflow-hidden">
      <Header />
      <main className="flex-grow bg-background text-foreground">
        {/* About Us Hero */}
        <section className="relative py-20 lg:py-32 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-zinc-50/50 dark:bg-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
             <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-islamic-green-500/5 dark:bg-islamic-green-500/8 rounded-full blur-[120px]" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-500/8 rounded-full blur-[120px]" />
          </div>
          
          <div className="container relative mx-auto px-4 z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="w-24 h-24 relative mb-8 p-3 bg-white dark:bg-zinc-800 rounded-[2rem] shadow-xl border border-border/50 dark:border-zinc-700">
                <Image 
                  src="/logo.png" 
                  alt="AR Book Sellers" 
                  fill 
                  className="object-contain p-2"
                />
              </div>
              <Badge className="bg-foreground text-background dark:bg-white dark:text-black border-none px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl">
                About Us
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tighter mb-6">
                Your Trusted Source for <span className="text-islamic-green-600 dark:text-islamic-green-500">Islamic Books</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium max-w-2xl mb-12 px-4">
                Since 2009, AR Publishers has been bringing quality Islamic books to readers all across Pakistan.
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-[2rem] border border-border/30 dark:border-zinc-700/50 backdrop-blur-md">
                  <p className="text-3xl lg:text-4xl font-amiri text-islamic-green-700 dark:text-islamic-green-400 mb-2 tracking-wide">
                    وَقُل رَّبِّ زِدْنِي عِلْمًا
                  </p>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-80">
                    "My Lord, increase me in knowledge" — Surah Ta-Ha (20:114)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-background relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 items-center gap-16">
              <div className="relative order-2 lg:order-1 px-4 lg:px-0">
                <div className="relative group">
                   <div className="absolute -inset-4 bg-islamic-green-600/10 rounded-[3rem] blur-3xl group-hover:bg-islamic-green-600/20 transition-all duration-1000" />
                   <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/20 dark:border-zinc-700/50">
                      <Image 
                        src="/scholar-desk.png" 
                        alt="AR Publishers Bookshop" 
                        width={800}
                        height={800}
                        className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
                      />
                   </div>
                </div>
                <div className="absolute -bottom-8 -right-4 lg:-right-8 w-32 h-32 bg-foreground text-background dark:bg-white dark:text-black rounded-[2rem] flex items-center justify-center border-8 border-background shadow-2xl z-10">
                   <div className="text-center">
                      <Scroll className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] leading-tight">Since<br/>2009</p>
                   </div>
                </div>
              </div>

              <div className="space-y-8 lg:order-2 px-4 lg:px-0">
                <div>
                   <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter leading-none mb-6">Our Journey Since 2009</h2>
                   <div className="h-1.5 w-16 bg-islamic-green-600 rounded-full" />
                </div>
                <div className="space-y-5 text-base font-medium text-muted-foreground leading-relaxed">
                  <p>
                    Our founder, <strong className="text-foreground font-black">Dr. Ahmad Rahman</strong>, recognized the need for a reliable source of authentic Islamic literature after struggling to find quality books for his own Islamic studies. With his background in scholarship and a passion for education, he began curating a collection from the most respected authors in the Islamic world.
                  </p>
                  <p>
                    Today, we work directly with renowned publishers like <strong className="text-foreground font-black">Darussalam</strong>, <strong className="text-foreground font-black">Islamic Foundation</strong>, and many others to ensure every book in our collection meets the highest standards. Our team of Islamic scholars carefully reviews each title to verify its adherence to authentic Islamic teachings.
                  </p>
                  <p>
                    What started as a small bookstore in our local community has grown into a trusted nationwide platform. Whether it's our signature printed Quran sets or wooden Rahals, we focus on products that are made with care and respect.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-5 rounded-2xl border border-border/50 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <p className="text-2xl font-black text-islamic-green-600 dark:text-islamic-green-400 mb-1">50,000+</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Happy Customers</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-border/50 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <p className="text-2xl font-black text-foreground mb-1">Nationwide</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 relative overflow-hidden border-y border-border/50 dark:border-zinc-800">
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="text-center mb-16">
               <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-4 px-4">What We Stand For</h2>
               <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[9px] opacity-70">Our values and promises</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <Card key={i} className="bg-white dark:bg-zinc-800/80 border border-border/50 dark:border-zinc-700/50 shadow-lg rounded-[2rem] transition-all hover:shadow-xl hover:-translate-y-2 group">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 bg-islamic-green-600/10 dark:bg-islamic-green-600/15 rounded-xl flex items-center justify-center mx-auto mb-6 border border-islamic-green-600/20 group-hover:bg-islamic-green-600 group-hover:text-white transition-all duration-500">
                      <value.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-foreground mb-3 tracking-tight">{value.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Numbers */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x divide-border/30">
               {[
                 { label: "Happy Customers", value: "50,000+" },
                 { label: "Books Available", value: "2,500+" },
                 { label: "Years in Business", value: "15+" },
                 { label: "Delivering Across", value: "Pakistan" }
               ].map((stat, i) => (
                 <div key={i} className="text-center lg:px-6">
                    <p className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter mb-3 leading-none">{stat.value}</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                    <div className="h-1 w-8 bg-islamic-green-600/30 mx-auto rounded-full" />
                 </div>
               ))}
             </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
