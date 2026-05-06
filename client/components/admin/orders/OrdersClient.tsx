"use client";

import { useState, useMemo, useCallback } from "react";
import type { AdminOrderDTO, OrderStatus, OrderFilter, UpdateOrderStatusInput } from "@/types/order";
import type { OrderStats as OrderStatsType } from "@/types/order";
import OrderStats from "./OrderStats";
import OrderTable from "./OrderTable";
import OrderCard from "./OrderCard";
import OrderStatusModal from "./OrderStatusModal";
import DeleteOrderModal from "./DeleteOrderModal";

type OrdersClientProps = {
  initialOrders: AdminOrderDTO[];
};

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<AdminOrderDTO[]>(initialOrders);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [loading, setLoading] = useState(false);
  const [statusOrder, setStatusOrder] = useState<AdminOrderDTO | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<AdminOrderDTO | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const stats: OrderStatsType = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthOrders = orders.filter((o) => new Date(o.createdAt) >= firstDayOfMonth);
    const thisMonthEarnings = thisMonthOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      thisMonthEarnings,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const handleUpdateStatus = useCallback(async (orderId: number, data: UpdateOrderStatusInput): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Update status error:", error);
        return;
      }

      // Update only the status field to preserve items and other properties
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: data.status } : o))
      );
      setStatusOrder(null);
    } catch (e) {
      console.error("Update status error:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const handleDeleteOrder = useCallback(async (): Promise<void> => {
    if (!deleteOrder) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${deleteOrder.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Delete order error:", error);
        return;
      }

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== deleteOrder.id));
        setDeleteOrder(null);
      }
    } catch (e) {
      console.error("Delete order error:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, deleteOrder]);

  const filterTabs: { key: OrderFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="w-9/10 mx-auto py-10 md:py-20">
      <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-black mb-8">
        ORDERS DASHBOARD
      </h1>

      {/* Stats */}
      <OrderStats stats={stats as any} />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-shrink-0 px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              filter === tab.key
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300 hover:border-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <OrderTable
        orders={filteredOrders}
        onViewDetails={() => {}}
        onUpdateStatus={setStatusOrder}
        onDelete={setDeleteOrder}
      />

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={() => {}}
            onUpdateStatus={setStatusOrder}
            onDelete={setDeleteOrder}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-400 py-20">No orders match this filter.</p>
      )}

      {/* Status Update Modal */}
      {statusOrder && (
        <OrderStatusModal
          order={statusOrder}
          onClose={() => setStatusOrder(null)}
          onSave={handleUpdateStatus}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteOrder && (
        <DeleteOrderModal
          order={deleteOrder}
          onClose={() => setDeleteOrder(null)}
          onConfirm={handleDeleteOrder}
          loading={loading}
        />
      )}
    </div>
  );
}
