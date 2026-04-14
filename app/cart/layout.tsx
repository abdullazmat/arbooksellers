import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected Islamic books in your shopping cart before proceeding to checkout. AR Book Sellers ensures a secure checkout experience.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
