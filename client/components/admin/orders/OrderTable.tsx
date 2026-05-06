import type { AdminOrderDTO, OrderStatus } from "@/types/order";
import { CheckCircle, XCircle, AlertCircle, Truck, Package, Eye, Pencil, Trash2 } from "lucide-react";

type OrderTableProps = {
  orders: AdminOrderDTO[];
  onViewDetails: (order: AdminOrderDTO) => void;
  onUpdateStatus: (order: AdminOrderDTO) => void;
  onDelete: (order: AdminOrderDTO) => void;
};

const statusColors: Record<OrderStatus, { color: string; bgColor: string }> = {
  pending: { color: "text-yellow-600", bgColor: "bg-yellow-50" },
  processing: { color: "text-blue-600", bgColor: "bg-blue-50" },
  shipped: { color: "text-purple-600", bgColor: "bg-purple-50" },
  delivered: { color: "text-green-600", bgColor: "bg-green-50" },
  cancelled: { color: "text-red-600", bgColor: "bg-red-50" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function getImageSrc(imageURL: string | null): string | null {
  if (!imageURL) return null;
  return imageURL.startsWith("http")
    ? imageURL
    : `${process.env.NEXT_PUBLIC_API_URL}${imageURL}`;
}

export default function OrderTable({ orders, onViewDetails, onUpdateStatus, onDelete }: OrderTableProps) {
  return (
    <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-4 text-sm font-medium text-gray-500">Order ID</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Items</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
            <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const colors = statusColors[order.status];
            const firstItemImage = getImageSrc(order.items?.[0]?.productImage);

            const StatusIcon = () => {
              switch (order.status) {
                case "pending": return <AlertCircle size={14} />;
                case "processing": return <Package size={14} />;
                case "shipped": return <Truck size={14} />;
                case "delivered": return <CheckCircle size={14} />;
                case "cancelled": return <XCircle size={14} />;
              }
            };

            return (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4">
                  <p className="font-semibold text-black">#{order.id}</p>
                </td>
                <td className="p-4">
                  <p className="font-medium text-black">{order.userEmail || "N/A"}</p>
                  <p className="text-xs text-gray-400">{order.userId.slice(0, 8)}...</p>
                </td>
                <td className="p-4">
                  <p className="text-black">{formatDate(order.createdAt)}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-black">{formatPrice(order.totalPrice)}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {firstItemImage && (
                      <div className="relative w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={firstItemImage}
                          alt=""
                          className="object-contain w-full h-full p-0.5"
                        />
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colors.bgColor} ${colors.color}`}>
                    <StatusIcon />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(order)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Update Status"
                    >
                      <Pencil size={18} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => onDelete(order)}
                      className="p-2 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Order"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
