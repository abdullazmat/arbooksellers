import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our collection of authentic Islamic books. We offer Quran, Hadith, Tafsir, and Islamic stories with fast delivery across Pakistan.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
