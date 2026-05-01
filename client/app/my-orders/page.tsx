"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: number;
  userId: string;
  totalPrice: number;
  adress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSessionAndFetchOrders = async () => {
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        router.replace("/sign-in");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8000/orders/user/${session.user.id}`,
          { credentials: "include" },
        );
        const data = await res.json();

        if (data.success) {
          setOrders(data.data);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-black">
                      ${order.totalPrice}
                    </p>
                    <p className="text-gray-500 text-sm">{order.adress}</p>
                  </div>
                </div>

                  {order.items && order.items.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Items
                      </h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2"
                          >
                            {item.productImage && (
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                  src={`http://localhost:8000${item.productImage}`}
                                  alt={item.productName || `Product ${item.productId}`}
                                  fill
                                  unoptimized
                                  className="object-cover rounded"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <span className="text-black font-medium">
                                {item.productName || `Product #${item.productId}`}
                              </span>
                              {item.productPrice && (
                                <span className="text-gray-600 text-sm ml-2">
                                  ${item.productPrice}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
