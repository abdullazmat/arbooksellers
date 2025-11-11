import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 md:pt-16 font-inter">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Islamic Books" className="h-20 w-20" />
          </Link>
          <p className="text-sm leading-relaxed">
            Your trusted source for authentic Islamic literature. We strive to
            provide a wide range of books to enrich your knowledge and faith.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://www.facebook.com/people/Abdul-Rahim-Quran-Company/61583701434737/?mibextid=wwXIfr&rdid=CrxxbCoFXndrKoR6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AdxwSUoxj%2F%3Fmibextid%3DwwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.instagram.com/ar.quran.company?igsh=anB6bms1dGRnMmh4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                All Books
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/products?category=quran"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                Quran
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=hadith"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                Hadith
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=islamic-studies"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                Islamic Studies
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=kids"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                Kids Books
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=biographies"
                className="text-sm hover:text-islamic-green-500 transition-colors"
              >
                Biographies
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-sm">
                17-Aziz Market, Urdu Bazar, Lahore
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-sm">+92-300-8016812</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Alrahim95@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 py-5 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Islamic Books. All rights reserved.
      </div>
    </footer>
  );
}
