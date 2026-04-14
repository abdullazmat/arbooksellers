import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 pt-16 md:pt-24 pb-12 font-inter relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-islamic-green-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group transition-transform hover:scale-105">
              <img src="/logo.png" alt="AR Book Sellers" className="h-20 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground font-medium max-w-sm">
              <strong className="text-foreground">AR Book Sellers</strong> is your trusted partner for authentic Islamic literature in Pakistan. Providing high-quality books since 2009.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com/arbookseller/", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/arbooksellers/", label: "Instagram" }
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-islamic-green-600 hover:border-islamic-green-500/50 transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-[0.2em] text-[12px]">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-islamic-green-600 font-bold transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-[2px] bg-islamic-green-500 mr-0 group-hover:mr-2 transition-all duration-300 overflow-hidden"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-[0.2em] text-[12px]">Categories</h3>
            <ul className="space-y-4">
              {[
                { name: 'Quran', slug: 'quran' },
                { name: 'Paras', slug: 'para-individual' },
                { name: 'Wazaif', slug: 'wazaif' },
                { name: 'Qaida & Surah', slug: 'qaida-surah' },
                { name: 'Accessories', slug: 'accessories' }
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-islamic-green-600 font-bold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-[0.2em] text-[12px]">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-islamic-green-50 dark:bg-islamic-green-950/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-islamic-green-600" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed font-medium">
                  17-Aziz Market, Urdu Bazar, Lahore
                </span>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-islamic-green-50 dark:bg-islamic-green-950/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-islamic-green-600" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed font-medium">+92-300-8016812</span>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-islamic-green-50 dark:bg-islamic-green-950/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-islamic-green-600" />
                </div>
                <a href="mailto:contact@arbooksellers.com" className="text-sm text-muted-foreground hover:text-islamic-green-600 leading-relaxed font-medium transition-colors">
                  contact@arbooksellers.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-center md:text-left transition-colors hover:text-foreground">
            &copy; {new Date().getFullYear()} AR Book Sellers | 15 Years of Trusted Service in Pakistan
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
