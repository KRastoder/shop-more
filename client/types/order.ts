export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItemDTO = {
  id: number;
  productId: number;
  quantity: number | null;
  color: string | null;
  size: string | null;
  productName: string | null;
  productPrice: number | null;
  productImage: string | null;
};

export type AdminOrderDTO = {
  id: number;
  userId: string;
  userEmail: string | null;
  totalPrice: number;
  address: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDTO[];
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};

export type OrderStats = {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  thisMonthEarnings: number;
};

export type OrderFilter = OrderStatus | "all";
