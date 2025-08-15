"use client";

import { useState, useEffect } from "react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronUp, ChevronDown, Truck, Download } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { downloadInvoiceAsPDF } from "@/lib/invoice";

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  createdAt: string;
  items: Array<{
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    fullName?: string;
    email?: string;
    phone?: string;
    street: string;
    address?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  trackingNumber?: string;
}

export function OrderHistory() {
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Calculate paginated orders
  const ordersPerPage = 10;
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = allOrders.slice(startIndex, endIndex);

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
          image: item.image,
        })),
        shippingAddress: {
          fullName:
            order.shippingAddress.fullName || order.shippingAddress.street,
          email: order.shippingAddress.email || user?.email || "",
          phone: order.shippingAddress.phone || "",
          address:
            order.shippingAddress.street || order.shippingAddress.address || "",
          city: order.shippingAddress.city || "",
          state: order.shippingAddress.state || "",
          zipCode: order.shippingAddress.zipCode || "",
          country: order.shippingAddress.country || "",
        },
        paymentMethod:
          order.paymentMethod === "cash_on_delivery"
            ? "Cash on Delivery"
            : order.paymentMethod || "Cash on Delivery",
        subtotal: order.subtotal || 0,
        shippingCost: order.shippingCost || 0,
        tax: order.tax || 0,
        total: order.total,
      };

      downloadInvoiceAsPDF(invoiceData);

      toast({
        title: "Invoice Generated",
        description:
          "Invoice has been opened in a new window. You can print or save it.",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, selectedStatus, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Filter orders by status if needed
      let filteredOrders = data.orders;
      if (selectedStatus !== 'all') {
        filteredOrders = data.orders.filter((order: Order) => order.orderStatus === selectedStatus);
      }
      
      setAllOrders(filteredOrders);
      
      // Calculate pagination from total orders
      const totalOrdersCount = filteredOrders.length;
      setTotalOrders(totalOrdersCount);
      setTotalPages(Math.ceil(totalOrdersCount / ordersPerPage));
      
      // Reset to first page when status changes
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when status changes
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
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ChevronDown className="h-4 w-4" />;
      case "processing":
        return <ChevronUp className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <ChevronUp className="h-4 w-4" />;
      default:
        return <ChevronDown className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (paginatedOrders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedStatus === 'all'
              ? "You haven't placed any orders yet."
              : `No ${selectedStatus} orders found.`}
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">
            Track your orders and view order details
          </p>
        </div>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <select value={selectedStatus} onChange={(e) => handleStatusChange(e.target.value)} className="w-48">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

              {/* Orders List */}
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
          <Card key={order._id} className="mb-4 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.orderNumber || order._id.slice(-6)}
                  </CardTitle>
                  <CardDescription>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      order.orderStatus === 'delivered'
                        ? 'default'
                        : order.orderStatus === 'shipped'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order._id ? null : order._id
                      )
                    }
                  >
                    {expandedOrder === order._id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Order Items Preview */}
              <div className="mb-4">
                <div className="flex items-center space-x-4 mb-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Total: {formatPrice(order.total)}
                </div>
                <div className="flex items-center space-x-2">
                  {order.trackingNumber && (
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4 mr-1" />
                      Track Package
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download Invoice
                  </Button>
                  {order.orderStatus === 'delivered' && (
                    <Button variant="outline" size="sm">
                      Buy Again
                    </Button>
                  )}
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order._id && (
                <div className="border-t bg-gray-50 p-6 mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Items Ordered</h4>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.title}</h5>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                              <p className="text-sm font-medium">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{formatPrice(order.shippingCost || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{formatPrice(order.tax || 0)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">Tracking Information</h5>
                          <p className="text-sm text-blue-700">
                            Tracking Number: {order.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {/* Generate page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
