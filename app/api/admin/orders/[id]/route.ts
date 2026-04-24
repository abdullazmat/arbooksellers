import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("items.product", "title author images")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Get admin order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const updateData = await request.json();

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order updated successfully",
      order,
    });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("PATCH request received for order:", id);

    const auth = verifyAuth(request);
    console.log("Auth result:", {
      hasAuth: !!auth,
      role: auth?.role,
      userId: auth?.userId,
    });

    if (!auth || auth.role !== "admin") {
      console.log("Auth failed:", { auth, role: auth?.role });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const updateData = await request.json();
    console.log("Update data received:", updateData);

    // Validate that we're only updating allowed fields
    const allowedFields = [
      "orderStatus",
      "paymentStatus",
      "trackingNumber",
      "notes",
    ];
    const filteredData: any = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    console.log("Filtered data:", filteredData);

    // Validate order status if it's being updated
    if (filteredData.orderStatus) {
      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(filteredData.orderStatus)) {
        console.log("Invalid order status:", filteredData.orderStatus);
        return NextResponse.json(
          {
            error: "Invalid order status",
          },
          { status: 400 },
        );
      }

      // Auto-complete payment when order is delivered
      if (filteredData.orderStatus === "delivered") {
        console.log("Order marked as delivered, auto-completing payment");

        // Check if payment has failed - can't deliver failed payment orders
        const currentOrder = await Order.findById(id);
        if (currentOrder && currentOrder.paymentStatus === "failed") {
          return NextResponse.json(
            {
              error:
                "Cannot mark order as delivered when payment has failed. Please resolve payment issue first.",
            },
            { status: 400 },
          );
        }

        filteredData.paymentStatus = "paid";
      }

      // Handle cancelled orders - mark payment as failed if it was pending
      if (filteredData.orderStatus === "cancelled") {
        console.log("Order marked as cancelled, updating payment status");
        // Only change payment status if it was pending (don't change if already paid)
        if (!filteredData.paymentStatus) {
          // Get current order to check current payment status
          const currentOrder = await Order.findById(id);
          if (currentOrder && currentOrder.paymentStatus === "pending") {
            filteredData.paymentStatus = "failed";
            console.log("Payment marked as failed for cancelled order");
          }
        }
      }

      // Handle shipped orders - ensure payment status is appropriate
      if (filteredData.orderStatus === "shipped") {
        console.log("Order marked as shipped, checking payment status");
        // Get current order to check current payment status and payment method
        const currentOrder = await Order.findById(id);
        if (currentOrder) {
          // For COD orders, payment should remain pending until delivery
          // For pre-paid orders, payment should already be paid
          if (currentOrder.paymentMethod === "cash_on_delivery") {
            // COD orders should keep payment as pending
            if (!filteredData.paymentStatus) {
              filteredData.paymentStatus = "pending";
            }
          } else {
            // Pre-paid orders should be paid before shipping
            if (
              !filteredData.paymentStatus &&
              currentOrder.paymentStatus === "pending"
            ) {
              console.log(
                "Warning: Pre-paid order being shipped with pending payment",
              );
            }
          }
        }
      }
    }

    // Validate order status progression
    if (filteredData.orderStatus) {
      const currentOrder = await Order.findById(id);
      if (currentOrder) {
        const currentStatus = currentOrder.orderStatus;
        const newStatus = filteredData.orderStatus;

        // Define valid status transitions
        const validTransitions: { [key: string]: string[] } = {
          pending: ["processing", "cancelled"],
          processing: ["shipped", "cancelled"],
          shipped: ["delivered", "cancelled"],
          delivered: [], // Can't change from delivered
          cancelled: [], // Can't change from cancelled
        };

        if (
          validTransitions[currentStatus] &&
          !validTransitions[currentStatus].includes(newStatus)
        ) {
          return NextResponse.json(
            {
              error: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Valid transitions are: ${validTransitions[currentStatus].join(", ")}`,
            },
            { status: 400 },
          );
        }
      }
    }

    // Collect warnings for payment status mismatches
    const warnings: string[] = [];

    // Check for payment method and status mismatches
    if (filteredData.orderStatus) {
      const currentOrder = await Order.findById(id);
      if (currentOrder) {
        if (
          filteredData.orderStatus === "shipped" &&
          currentOrder.paymentMethod !== "cash_on_delivery" &&
          currentOrder.paymentStatus === "pending"
        ) {
          warnings.push(
            "Warning: Pre-paid order is being shipped with pending payment",
          );
        }

        if (
          filteredData.orderStatus === "delivered" &&
          currentOrder.paymentMethod === "cash_on_delivery" &&
          currentOrder.paymentStatus === "pending"
        ) {
          warnings.push(
            "Payment automatically completed for COD order upon delivery",
          );
        }
      }
    }

    // Validate payment status if it's being updated
    if (filteredData.paymentStatus) {
      const validPaymentStatuses = ["pending", "paid", "failed"];
      if (!validPaymentStatuses.includes(filteredData.paymentStatus)) {
        console.log("Invalid payment status:", filteredData.paymentStatus);
        return NextResponse.json(
          {
            error: "Invalid payment status",
          },
          { status: 400 },
        );
      }
    }

    console.log("Updating order with data:", filteredData);

    const order = await Order.findByIdAndUpdate(id, filteredData, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    if (!order) {
      console.log("Order not found:", id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order updated successfully:", order._id);

    // Prepare response message
    let responseMessage = "Order updated successfully";
    if (
      filteredData.orderStatus === "delivered" &&
      filteredData.paymentStatus === "paid"
    ) {
      responseMessage =
        "Order marked as delivered and payment completed automatically";
    } else if (
      filteredData.orderStatus === "cancelled" &&
      filteredData.paymentStatus === "failed"
    ) {
      responseMessage = "Order cancelled and payment marked as failed";
    } else if (filteredData.orderStatus === "delivered") {
      responseMessage =
        "Order marked as delivered and payment completed automatically";
    } else if (filteredData.orderStatus === "cancelled") {
      responseMessage = "Order cancelled successfully";
    }

    return NextResponse.json({
      message: responseMessage,
      order,
      warnings,
    });
  } catch (error: any) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order deleted successfully",
      deletedOrderId: id,
    });
  } catch (error: any) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
