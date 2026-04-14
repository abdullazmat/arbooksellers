"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  MessageSquare,
  Folder,
  Shield,
  Globe,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { AdminAuthProvider } from "@/contexts/admin-auth-context";

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { adminUser: user, isLoading } = useAdminAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/admin/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [user, isLoading, router]);

  const { adminSignOut } = useAdminAuth();

  const handleLogout = () => {
    adminSignOut();
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Folder },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
    { name: "Contacts", href: "/admin/contacts", icon: FileText },
    { name: "Newsletter", href: "/admin/newsletter", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActiveTab = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
             <div className="absolute inset-0 rounded-full border-t-2 border-islamic-green-600 animate-spin" />
             <div className="absolute inset-2 rounded-full border-b-2 border-blue-500 animate-spin-slow" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] animate-pulse">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] font-inter selection:bg-islamic-green-100 selection:text-islamic-green-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-border/40 transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-8 pb-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl flex items-center justify-center p-2 group-hover:bg-islamic-green-600 transition-all duration-500 shadow-xl">
                <Shield className="w-6 h-6 shrink-0" />
              </div>
              <div className="leading-none">
                <span className="text-xl font-black text-foreground tracking-tight">Admin Dashboard</span>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">Store Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide pb-10">
            <p className="px-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-50">Menu</p>
            {navigation.map((item) => {
              const active = isActiveTab(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 group ${
                    active 
                      ? "bg-foreground text-background dark:bg-white dark:text-black shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] scale-[1.02]" 
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-4.5 h-4.5 shrink-0 transition-all duration-300 group-hover:scale-110 ${active ? "text-islamic-green-500 shadow-islamic-green-500" : ""}`} />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="w-4 h-4 text-islamic-green-500" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 mt-auto">
            <div className="p-6 bg-zinc-100/50 dark:bg-white/5 rounded-[2.5rem] border border-border/40">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-islamic-green-600 flex items-center justify-center text-white font-black text-sm shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                  {user.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-foreground truncate uppercase tracking-[0.1em]">{user.name}</p>
                  <p className="text-[9px] font-bold text-muted-foreground truncate opacity-60">Admin Access</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full h-12 rounded-[1.25rem] border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-black text-[10px] uppercase tracking-widest transition-all gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-500">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-24 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex h-full items-center justify-between px-8 lg:px-12">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground lg:hidden transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="hidden md:flex items-center bg-zinc-100 dark:bg-white/5 rounded-2xl px-4 py-2 border border-border/40 w-64">
                <Search className="w-4 h-4 text-muted-foreground mr-3" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-xs font-bold text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
               <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-islamic-green-500/5 dark:bg-islamic-green-500/10 rounded-2xl border border-islamic-green-500/20">
                  <div className="h-2 w-2 rounded-full bg-islamic-green-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[10px] font-black text-islamic-green-600 dark:text-islamic-green-400 uppercase tracking-widest">Admin Active</p>
               </div>

               <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 text-muted-foreground relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                 </Button>
                 
                 <Link href="/" target="_blank">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-islamic-green-600 hover:text-white text-muted-foreground transition-all">
                      <Globe className="w-5 h-5" />
                    </Button>
                 </Link>
               </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="py-8 px-12 border-t border-border/40 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-4">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">© 2024 AR Publishers Admin</p>
           <div className="flex gap-6">
              <Link href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Documentation</Link>
              <Link href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Support</Link>
           </div>
        </footer>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
