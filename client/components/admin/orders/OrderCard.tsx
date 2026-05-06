import type { AdminOrderDTO, OrderStatus } from "@/types/order";
import { CheckCircle, XCircle, AlertCircle, Truck, Package, Eye, Pencil, Trash2 } from "lucide-react";

type OrderCardProps = {
  order: AdminOrderDTO;
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

export default function OrderCard({ order, onViewDetails, onUpdateStatus, onDelete }: OrderCardProps) {
  const colors = statusColors[order.status];
  const firstItemImage = getImageSrc(order.items?.[0]?.productImage);

  const StatusIcon = () => {
    switch (order.status) {
      case "pending": return <AlertCircle size={12} />;
      case "processing": return <Package size={12} />;
      case "shipped": return <Truck size={12} />;
      case "delivered": return <CheckCircle size={12} />;
      case "cancelled": return <XCircle size={12} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-black">Order #{order.id}</p>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bgColor} ${colors.color}`}>
          <StatusIcon />
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        {firstItemImage && (
          <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img src={firstItemImage} alt="" className="object-contain w-full h-full p-1" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-black truncate">
            {order.items[0]?.productName || "Product"}
          </p>
          <p className="text-xs text-gray-400">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <p className="font-bold text-black">{formatPrice(order.totalPrice)}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">{order.userEmail || "N/A"}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(order)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            title="View Details"
          >
            <Eye size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onUpdateStatus(order)}
            className="p-1.5 hover:bg-blue-50 rounded-lg transition cursor-pointer"
            title="Update Status"
          >
            <Pencil size={16} className="text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(order)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition cursor-pointer"
            title="Delete Order"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
