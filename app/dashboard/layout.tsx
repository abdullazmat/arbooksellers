import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your AR Book Sellers account, track current orders, review purchase history, and update your delivery addresses in one secure place.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
