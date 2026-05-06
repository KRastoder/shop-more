import type { AdminOrderDTO, OrderStatus, UpdateOrderStatusInput } from "@/types/order";
import { X } from "lucide-react";
import { useState } from "react";

type OrderStatusModalProps = {
  order: AdminOrderDTO;
  onClose: () => void;
  onSave: (orderId: number, data: UpdateOrderStatusInput) => Promise<void>;
  loading: boolean;
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderStatusModal({ order, onClose, onSave, loading }: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSave(order.id, { status: selectedStatus });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">
            Update Order Status
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Order #{order.id}</p>
            <p className="text-sm text-gray-500 mb-4">Current Status: <span className="font-semibold">{order.status}</span></p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Select New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                    selectedStatus === option.value
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={() => setSelectedStatus(option.value)}
                    className="w-4 h-4 text-black cursor-pointer"
                  />
                  <span className="font-medium text-black">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-black font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedStatus === order.status}
              className="flex-1 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
