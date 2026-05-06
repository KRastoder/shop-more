import type { AdminOrderDTO } from "@/types/order";
import { X } from "lucide-react";

type DeleteOrderModalProps = {
  order: AdminOrderDTO;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
};

export default function DeleteOrderModal({ order, onClose, onConfirm, loading }: DeleteOrderModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-black">Delete Order</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold">Order #{order.id}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-black font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
