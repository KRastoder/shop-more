import type { AdminOrderDTO } from "@/types/order";
import { X, AlertCircle, Package, Truck, CheckCircle, XCircle } from "lucide-react";

type OrderDetailsModalProps = {
  order: AdminOrderDTO;
  onClose: () => void;
};

const statusColors: Record<string, { color: string; bgColor: string }> = {
  pending: { color: "text-yellow-600", bgColor: "bg-yellow-50" },
  processing: { color: "text-blue-600", bgColor: "bg-blue-50" },
  shipped: { color: "text-purple-600", bgColor: "bg-purple-50" },
  delivered: { color: "text-green-600", bgColor: "bg-green-50" },
  cancelled: { color: "text-red-600", bgColor: "bg-red-50" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const colors = statusColors[order.status];

  const StatusIcon = () => {
    switch (order.status) {
      case "pending": return <AlertCircle size={16} />;
      case "processing": return <Package size={16} />;
      case "shipped": return <Truck size={16} />;
      case "delivered": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">
            Order #{order.id} Details
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            {order.userEmail && (
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-black">{order.userEmail}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colors.bgColor} ${colors.color}`}>
                <StatusIcon />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-black">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-black">{formatPrice(order.totalPrice)}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
            <p className="text-black bg-gray-50 p-3 rounded-lg">{order.address}</p>
          </div>

          {/* Order Items */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Items ({order.items?.length || 0})</p>
            <div className="space-y-3">
              {(order.items || []).map((item) => {
                const src = getImageSrc(item.productImage);
                return (
                  <div key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {src ? (
                        <img src={src} alt="" className="object-contain w-full h-full p-1" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-black">{item.productName || "Product"}</p>
                      <p className="text-sm text-gray-500">
                        {item.color && `Color: ${item.color}`}
                        {item.color && item.size && " / "}
                        {item.size && `Size: ${item.size}`}
                      </p>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-600">Qty: {item.quantity ?? 0}</p>
                        <p className="text-sm font-medium text-black">
                          {item.productPrice ? formatPrice(item.productPrice * (item.quantity ?? 0)) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
