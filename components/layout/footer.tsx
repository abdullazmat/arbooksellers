import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

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
              href="https://www.facebook.com/arbookseller/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.instagram.com/arbooksellers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.pinterest.com/arbooksellers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
              aria-label="Pinterest"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.419 2.561-5.419 5.208 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.93 0 4.135-2.607 7.462-6.225 7.462-1.215 0-2.358-.632-2.75-1.378l-1.378-1.378c-.524-1.378-.524-2.857-.524-3.333s.524-.857 1.048-.857z" />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/company/arbooksellers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-islamic-green-500 transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
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
              <a href="mailto:contact@arbooksellers.com" className="text-sm hover:text-islamic-green-500 transition-colors">
                contact@arbooksellers.com
              </a>
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
