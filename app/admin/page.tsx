"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Clock,
  ExternalLink,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  processingOrders: number;
}

interface RecentOrder {
  _id: string;
  orderNumber?: string;
  user?: {
    name?: string;
    email?: string;
  };
  total: number;
  orderStatus: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    processingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const ordersResponse = await fetch("/api/admin/orders?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!ordersResponse.ok) throw new Error("Orders failed");
      const ordersData = await ordersResponse.json();

      const usersResponse = await fetch("/api/admin/users?limit=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersResponse.json();

      const productsResponse = await fetch("/api/admin/products?limit=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productsData = await productsResponse.json();

      setStats({
        totalSales: ordersData.stats?.totalSales || 0,
        totalOrders: ordersData.stats?.totalOrders || 0,
        totalUsers: usersData.stats?.totalUsers || 0,
        totalProducts: productsData.pagination?.total || 0,
        pendingOrders: ordersData.stats?.pendingOrders || 0,
        processingOrders: ordersData.stats?.processingOrders || 0,
      });

      if (ordersData.orders && Array.isArray(ordersData.orders)) {
        setRecentOrders(ordersData.orders.slice(0, 5));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "shipped": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "delivered": return "bg-islamic-green-500/10 text-islamic-green-500 border-islamic-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter">Dashboard</h1>
            <p className="text-muted-foreground font-medium text-lg">Store analytics and overview</p>
          </div>
          <div className="flex items-center gap-3">
             <Button onClick={fetchDashboardData} variant="outline" className="h-12 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest gap-2 bg-background/50 backdrop-blur-sm border-border/50">
                <Activity className="w-4 h-4 text-islamic-green-500" /> Refresh Data
             </Button>
             <Button asChild className="h-12 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-islamic-green-600 hover:text-white transition-all">
                <Link href="/admin/orders">
                  <ExternalLink className="w-4 h-4" /> View All Orders
                </Link>
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={`stat-skeleton-${i}`} className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-8 w-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-3 mt-1" />
                  <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : (
            [
              { label: "Gross Revenue", value: formatPrice(stats.totalSales), icon: DollarSign, color: "text-islamic-green-500", trend: "+12.5%", isUp: true },
              { label: "Active Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-500", trend: "+8.2%", isUp: true },
              { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-500", trend: "+15.0%", isUp: true },
              { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-amber-500", trend: "+5.4%", isUp: true },
            ].map((stat, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-xl border border-border/40 hover:border-islamic-green-500/30 transition-all duration-500 group rounded-[2.5rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</span>
                  <div className={`p-2 rounded-xl bg-zinc-100 dark:bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                     <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground tracking-tight mb-2">{stat.value}</div>
                  <div className="flex items-center gap-2">
                     {stat.isUp ? <ArrowUpRight className="h-3 w-3 text-islamic-green-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                     <span className={`text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-islamic-green-500' : 'text-red-500'}`}>
                       {stat.trend} <span className="text-muted-foreground opacity-50 ml-1">vs L30D</span>
                     </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tactical Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed: Recent Orders */}
          <Card className="lg:col-span-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-border/40 rounded-[3rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-foreground tracking-tight">Recent Orders</CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Latest store orders</CardDescription>
              </div>
              <Button asChild variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:text-islamic-green-600">
                <Link href="/admin/orders">
                  View All <ChevronRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={`order-skeleton-${i}`} className="p-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse delay-75" />
                             <div className="space-y-3">
                                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-2 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse delay-100" />
                             </div>
                          </div>
                          <div className="flex items-center gap-8">
                             <div className="text-right hidden sm:flex flex-col items-end gap-2">
                                <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse delay-75" />
                             </div>
                             <div className="w-20 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                          </div>
                       </div>
                    </div>
                  ))
                ) : recentOrders.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                     <Clock className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No Recent Orders</p>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order._id} className="p-6 hover:bg-zinc-100/50 dark:hover:bg-white/5 transition-colors group">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-zinc-100 dark:bg-background rounded-2xl flex items-center justify-center border border-border/40 font-black text-xs text-muted-foreground">
                                #{order.orderNumber?.slice(-4) || order._id.slice(-4)}
                             </div>
                             <div>
                                <p className="font-black text-foreground uppercase tracking-widest text-sm">{order.user?.name || 'Unknown User'}</p>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-8">
                             <div className="text-right hidden sm:block">
                                <p className="font-black text-foreground text-lg tracking-tight">{formatPrice(order.total)}</p>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Gross Total</p>
                             </div>
                             <Badge className={`px-4 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-[0.2em] shadow-sm ${getStatusStyle(order.orderStatus)}`}>
                                {order.orderStatus}
                             </Badge>
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Side Panel: Order Pipeline */}
          <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[3rem] overflow-hidden">
               <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-xl font-black text-foreground tracking-tight uppercase">Order Status</CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-4">
                     {loading ? (
                       <>
                         <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/10 border border-border/20 p-5 rounded-[1.5rem] animate-pulse">
                            <div className="space-y-3">
                               <div className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                               <div className="h-6 w-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            </div>
                            <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800" />
                         </div>
                         <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/10 border border-border/20 p-5 rounded-[1.5rem] animate-pulse delay-75">
                            <div className="space-y-3">
                               <div className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                               <div className="h-6 w-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            </div>
                            <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800" />
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="flex justify-between items-center bg-amber-500/5 border border-amber-500/20 p-5 rounded-[1.5rem] group hover:bg-amber-500/10 transition-all">
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Pending</p>
                               <p className="text-3xl font-black text-amber-600">{stats.pendingOrders}</p>
                            </div>
                            <Clock className="w-8 h-8 text-amber-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                         </div>
                         <div className="flex justify-between items-center bg-blue-500/5 border border-blue-500/20 p-5 rounded-[1.5rem] group hover:bg-blue-500/10 transition-all">
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Processing</p>
                               <p className="text-3xl font-black text-blue-600">{stats.processingOrders}</p>
                            </div>
                            <Activity className="w-8 h-8 text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                         </div>
                       </>
                     )}
                  </div>
                  
                  <div className="pt-6 border-t border-border/40 space-y-4">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Quick Actions</p>
                     <Button 
                        asChild
                        className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-islamic-green-600 hover:text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all"
                     >
                        <Link href="/admin/products">
                          Add New Product
                        </Link>
                     </Button>
                     <Button 
                        asChild
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-border/50 font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/10"
                     >
                        <Link href="/admin/settings">
                          Settings
                        </Link>
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="p-8 bg-islamic-green-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                  <Shield className="w-24 h-24" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Admin Dashboard</p>
               <h3 className="text-xl font-black tracking-tight mb-2 leading-tight">Welcome back</h3>
               <p className="text-xs font-bold opacity-80 leading-relaxed font-inter">Manage your store, products, and orders here.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
