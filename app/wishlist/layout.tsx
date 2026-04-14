import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your saved Islamic books. Keep track of the Quran and literature you want to purchase later at AR Book Sellers.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
