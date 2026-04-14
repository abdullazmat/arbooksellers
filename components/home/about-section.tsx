import { Scroll, Globe, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-24 bg-background font-inter overflow-hidden relative border-y border-border">
      {/* Subtle organic background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-islamic-green-50 dark:bg-islamic-green-950/30 rounded-full blur-[120px] opacity-40 -mr-64 -mt-64"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          {/* Text Area */}
          <div className="flex-1 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-islamic-green-50 dark:bg-islamic-green-950/30 border border-islamic-green-100 dark:border-islamic-green-800">
                <Sparkles className="w-4 h-4 text-islamic-green-600" />
                <span className="text-islamic-green-700 dark:text-islamic-green-400 font-bold tracking-widest uppercase text-[10px]">
                  Founded on Authenticity
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.1] text-foreground">
                <span className="text-islamic-green-600">Islamic Books</span>{" "}
                for Everyday Learning
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium italic border-l-4 border-islamic-gold-400 pl-6">
                "AR Book Sellers started with a simple idea that every home
                should have access to authentic, reliable Islamic books."
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  We are a trusted Islamic bookstore in Pakistan. We proudly
                  offer printed copies of the Holy Quran Majeed with Urdu and
                  English translations, specially designed for easy
                  understanding and study.
                </p>
                <p>
                  For students, we provide useful learning materials like single
                  paras, complete Quran para sets, and separate surahs. We also
                  have helpful items for daily worship, including wazaif, namaz
                  guides, and duas.
                </p>
                <p>
                  To make your study space complete, we offer wooden Quran
                  stands (rahal) and elegant Quran gift boxes. These are made
                  with care and can be kept and used for many years.
                </p>
              </div>
            </div>
          </div>

          {/* Image and Stats Area */}
          <div className="lg:w-5/12 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(22,101,52,0.2)] border-[12px] border-white dark:border-gray-800 group">
              <Image
                src="/about_us_islamic_books_collage.png"
                alt="AR Book Sellers Erudite Collection"
                width={800}
                height={1000}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-islamic-green-900/60 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Elegant Floating Badge */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-islamic-gold-500 rounded-full flex flex-col items-center justify-center text-white p-6 text-center border-8 border-white dark:border-gray-800 shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
              <Scroll className="w-8 h-8 mb-1" />
              <span className="text-xs font-bold uppercase tracking-widest leading-none">
                Established
              </span>
              <span className="text-2xl font-black">Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
