import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an account with AR Book Sellers to easily purchase Quran, Hadith, and Islamic literature online with fast delivery in Pakistan.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
