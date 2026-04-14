import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Thank you for shopping at AR Book Sellers. Your order for authentic Islamic literature has been received and is being processed quickly.",
};

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
