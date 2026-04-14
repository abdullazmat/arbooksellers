import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely. AR Book Sellers offers reliable delivery for your selected Quran, Tafsir, and Islamic literature anywhere.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
