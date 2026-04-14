"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  Package,
  User,
  Calendar,
  DollarSign,
  Download,
  X,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { downloadInvoiceAsPDF } from "@/lib/invoice";

interface Order {
  _id: string;
  orderNumber?: string;
  user?: {
    name?: string;
    email?: string;
  };
  items: Array<{
    product: {
      _id: string;
      title: string;
      images: string[];
    };
    title: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { toast } = useToast();

  // Check if admin token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenPayload.exp && tokenPayload.exp < currentTime;
    } catch (error) {
      return true; // Assume expired if we can't parse
    }
  };

  // Check admin authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token || isTokenExpired(token)) {
      toast({
        title: "Session Expired",
        description: "Your admin session has expired. Please login again.",
        variant: "destructive",
      });
      window.location.href = "/admin/login";
      return;
    }
  }, [toast]);

  const handleDownloadInvoice = (order: Order) => {
    try {
      // Format the order data for invoice generation
      const invoiceData = {
        orderNumber: order.orderNumber || order._id.slice(-6),
        orderDate: new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        items: order.items.map((item) => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: getProductImageUrl(item.product?.images?.[0]),
        })),
        shippingAddress: {
          fullName: order.shippingAddress.fullName,
          email: order.user?.email || "customer@example.com",
          phone: "",
          address: order.shippingAddress.address,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zipCode: order.shippingAddress.zipCode,
          country: order.shippingAddress.country,
        },
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        total: order.total,
      };

      downloadInvoiceAsPDF(invoiceData);

      toast({
        title: "Invoice Generated",
        description:
          "Invoice has been opened in a new window. You can print or save it.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      toast({ title: "No data", description: "There are no orders to export.", variant: "destructive" });
      return;
    }
    const headers = ["Order ID", "Customer Name", "Customer Email", "Total Items", "Total Amount", "Payment Status", "Payment Method", "Order Status", "Date"];
    const csvContent = orders.map(order => [
      order.orderNumber || order._id,
      `"${order.shippingAddress.fullName || ''}"`,
      `"${order.user?.email || ''}"`,
      order.items.length,
      order.total,
      order.paymentStatus,
      order.paymentMethod,
      order.orderStatus,
      new Date(order.createdAt).toISOString()
    ].join(","));
    
    const csvString = [headers.join(","), ...csvContent].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Admin token not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        toast({
          title: "Session Expired",
          description: "Your admin session has expired. Please login again.",
          variant: "destructive",
        });
        window.location.href = "/admin/login";
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Admin token not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        toast({
          title: "Session Expired",
          description: "Your admin session has expired. Please login again.",
          variant: "destructive",
        });
        window.location.href = "/admin/login";
        return;
      }

      const requestBody = { orderStatus: newStatus };

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - Please login again");
        } else if (response.status === 404) {
          throw new Error("Order not found");
        } else if (response.status === 400) {
          throw new Error(responseData.error || "Invalid request data");
        } else {
          throw new Error(
            `Server error: ${responseData.error || "Unknown error"}`
          );
        }
      }

      // Show appropriate success message
      const successMessage =
        responseData.message || "Order status updated successfully";
      toast({
        title: "Success",
        description: successMessage,
      });

      // Show warnings if any
      if (responseData.warnings && responseData.warnings.length > 0) {
        responseData.warnings.forEach((warning: string) => {
          toast({
            title: "Warning",
            description: warning,
            variant: "default",
          });
        });
      }

      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return formatPrice(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-zinc-100 dark:bg-white/5 text-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-zinc-100 dark:bg-white/5 text-foreground";
    }
  };

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 selection:bg-islamic-green-100 selection:text-islamic-green-900">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Order Logs</h1>
            <p className="text-muted-foreground font-medium mt-1">Track and manage customer transactions worldwide</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" onClick={exportToCSV} className="flex-1 md:flex-none h-12 rounded-xl font-bold border-border/50 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
             </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 pb-6 px-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground">Activity Filters</CardTitle>
                <CardDescription className="font-medium">Pinpoint specific orders</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-islamic-green-600 h-5 w-5 transition-colors" />
                  <Input
                    placeholder="Search by name, email, or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-zinc-100/50 dark:bg-background border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-14 px-6 rounded-2xl bg-zinc-100/50 dark:bg-background border border-border/50 focus:outline-none focus:ring-2 focus:ring-islamic-green-500 font-bold text-sm min-w-[200px] appearance-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button 
                  className="h-14 w-14 rounded-2xl p-0 bg-background border border-border/50 text-foreground hover:bg-islamic-green-600 hover:text-white transition-all"
                  onClick={fetchOrders}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
         <Card className="bg-card border-border/50 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 p-8">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-black text-foreground tracking-tight">Active Transactions</CardTitle>
                <CardDescription className="font-medium mt-1">Found {orders.length} orders matching your criteria</CardDescription>
              </div>
              <Badge variant="outline" className="h-8 rounded-xl font-bold border-blue-500/30 text-blue-600 bg-blue-500/10 px-4">
                Refreshed Just Now
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-50/50 dark:bg-white/2">
                  <TableRow className="hover:bg-transparent border-border/50 h-16">
                    <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Reference</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Customer</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Cart Info</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Amount</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Payment</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Execution Status</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Timestamp</TableHead>
                    <TableHead className="text-right px-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="border-border/50 hover:bg-zinc-50/50 dark:hover:bg-white/2 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center border border-border/50">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-black text-foreground tracking-tight">
                            #{order.orderNumber || order._id.slice(-6)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 max-w-[180px]">
                            <div className="font-black text-foreground truncate text-sm">
                              {order.shippingAddress.fullName}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-wider mt-0.5">
                              {order.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs font-black text-foreground">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "Product" : "Products"}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground truncate max-w-[150px] uppercase tracking-widest">
                            {order.items[0]?.title}
                            {order.items.length > 1 &&
                              ` +${order.items.length - 1} More`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-black text-foreground text-base tracking-tighter leading-none">
                            {formatPrice(order.total)}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Net Total
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <Badge
                            className={`${getPaymentStatusColor(order.paymentStatus)} border-none text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg`}
                          >
                            {order.paymentStatus}
                          </Badge>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                             <DollarSign className="h-3 w-3" />
                             {order.paymentMethod}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-3">
                          <Badge className={`${getStatusColor(order.orderStatus)} border-none text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg shadow-sm`}>
                            {order.orderStatus}
                          </Badge>
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="w-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-background border border-border/50 rounded-lg px-2 py-2 focus:ring-2 focus:ring-islamic-green-600 transition-all cursor-pointer shadow-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          <Calendar className="h-3.5 w-3.5 opacity-50" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end space-x-2">
                           <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-800 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            onClick={() => handleDownloadInvoice(order)}
                          >
                            <Download className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-8 border-t border-border/50 bg-zinc-50/50 dark:bg-white/2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(Math.max(1, currentPage - 1));
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50 h-10 rounded-xl"
                            : "h-10 rounded-xl font-bold bg-background border-border/50"
                        }
                      />
                    </PaginationItem>

                    {/* First page */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                          }}
                           className="h-10 w-10 rounded-xl font-bold border-border/50"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis */}
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Page numbers around current page */}
                    {(() => {
                      const pages = [];
                      const startPage = Math.max(1, currentPage - 2);
                      const endPage = Math.min(totalPages, currentPage + 2);

                      for (
                        let pageNum = startPage;
                        pageNum <= endPage;
                        pageNum++
                      ) {
                        pages.push(pageNum);
                      }

                      return pages.map((pageNum) => (
                        <PaginationItem key={`page-${pageNum}`}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                            isActive={pageNum === currentPage}
                            className="h-10 w-10 rounded-xl font-black transition-all data-[active=true]:bg-islamic-green-600 data-[active=true]:text-white border-border/50"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ));
                    })()}

                    {/* Ellipsis */}
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                          }}
                           className="h-10 w-10 rounded-xl font-bold border-border/50"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(Math.min(totalPages, currentPage + 1));
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50 h-10 rounded-xl"
                            : "h-10 rounded-xl font-bold bg-background border-border/50"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-6 opacity-60">
                  Page {currentPage} of {totalPages} • Monitoring {orders.length} Global Transactions
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-background border border-border/50 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-islamic-green-500/10 flex items-center justify-center border border-islamic-green-500/20">
                         <Package className="h-7 w-7 text-islamic-green-600" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tighter">
                          Transaction Details
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Reference: #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}</p>
                      </div>
                   </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 group"
                    onClick={() => {
                      setShowOrderModal(false);
                      setSelectedOrder(null);
                    }}
                  >
                    <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Order Information */}
                  <Card className="bg-zinc-50/50 dark:bg-white/2 border-border/30 rounded-[2rem] p-8">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Core Information</h3>
                     <div className="space-y-4">
                        {[
                          { label: "Execution Ref", value: `#${selectedOrder.orderNumber || selectedOrder._id.slice(-6)}`, type: "text" },
                          { label: "Timestamp", value: formatDate(selectedOrder.createdAt), type: "text" },
                          { label: "Operational Status", value: selectedOrder.orderStatus, type: "badge", color: getStatusColor(selectedOrder.orderStatus) },
                          { label: "Payment Status", value: selectedOrder.paymentStatus, type: "badge", color: getPaymentStatusColor(selectedOrder.paymentStatus) },
                          { label: "Channel", value: selectedOrder.paymentMethod, type: "text" },
                        ].map((row, i) => (
                           <div key={i} className="flex justify-between items-center py-2">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{row.label}</span>
                              {row.type === "badge" ? (
                                <Badge className={`${row.color} border-none text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg`}>{row.value}</Badge>
                              ) : (
                                <span className="text-sm font-black text-foreground tracking-tight">{row.value}</span>
                              )}
                           </div>
                        ))}
                     </div>
                  </Card>

                  {/* Customer Information */}
                   <Card className="bg-zinc-50/50 dark:bg-white/2 border-border/30 rounded-[2rem] p-8">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Customer Profile</h3>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                              <span className="text-2xl font-black text-blue-600">{selectedOrder.shippingAddress.fullName.charAt(0)}</span>
                           </div>
                           <div>
                              <p className="text-lg font-black text-foreground">{selectedOrder.shippingAddress.fullName}</p>
                              <p className="text-sm font-medium text-muted-foreground">{selectedOrder.user?.email || "N/A"}</p>
                           </div>
                        </div>
                        <div className="pt-4 border-t border-border/30">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 leading-none">Shipping Destination</h4>
                            <div className="p-5 bg-card border border-border/30 rounded-2xl text-sm font-bold text-foreground leading-relaxed shadow-sm">
                              {selectedOrder.shippingAddress.address}<br />
                              <span className="text-muted-foreground uppercase text-[11px] tracking-wider">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</span><br />
                              <span className="text-muted-foreground uppercase text-[11px] tracking-wider font-black">{selectedOrder.shippingAddress.country}</span>
                            </div>
                        </div>
                     </div>
                  </Card>
                </div>

                {/* Order Items */}
                <div className="mt-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 ml-2">Shipment Manifest</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-5 bg-zinc-50/50 dark:bg-white/2 border border-border/30 rounded-3xl group hover:border-islamic-green-500/30 transition-all"
                      >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-20 bg-card rounded-2xl flex items-center justify-center border border-border/30 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                               <img
                                src={getProductImageUrl(item.product?.images?.[0])}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                               <p className="font-black text-foreground text-base tracking-tight leading-tight">{item.title}</p>
                               <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-zinc-100 dark:bg-white/5 py-1 px-2.5 rounded-lg border border-border/30">SKU: {item.product?._id?.slice(-6) || "N/A"}</span>
                                  <span className="text-[10px] font-black text-islamic-green-600 uppercase tracking-widest">Unit: {formatPrice(item.price)}</span>
                               </div>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-base font-black text-foreground">{item.quantity} × <span className="opacity-40">{formatPrice(item.price)}</span></p>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Line Total: {formatPrice(item.quantity * item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="mt-10 flex justify-end">
                  <Card className="max-w-md w-full bg-foreground text-background dark:bg-zinc-800 dark:text-foreground rounded-[2.5rem] p-10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-120 group-hover:rotate-12 transition-transform duration-1000">
                       <ShoppingCart className="h-40 w-40" />
                    </div>
                    <div className="space-y-4 relative z-10">
                       <div className="flex justify-between items-center opacity-60">
                          <span className="text-xs font-black uppercase tracking-widest">Subtotal Value</span>
                          <span className="font-bold">{formatPrice(selectedOrder.subtotal)}</span>
                       </div>
                       <div className="flex justify-between items-center opacity-60">
                          <span className="text-xs font-black uppercase tracking-widest">Allocation Fee</span>
                          <span className="font-bold">{formatPrice(selectedOrder.shippingCost)}</span>
                       </div>
                       <div className="h-px bg-current opacity-10 my-4" />
                       <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-black uppercase tracking-widest">Gross Total</span>
                          <span className="text-3xl font-black tracking-tighter">{formatPrice(selectedOrder.total)}</span>
                       </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
