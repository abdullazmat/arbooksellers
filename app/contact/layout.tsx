import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch at +92 300 8016812  or email contact@arbooksellers.com for inquiries about your orders, Islamic books, or wholesale purchases",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
