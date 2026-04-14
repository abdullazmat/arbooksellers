import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "AR Book Sellers is trusted Islamic bookstore in Pakistan for printed Quran, Hadith, Tafsir, and Islamic literature",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
