"use client";

import { useEffect, useState, useMemo } from "react";
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
  address: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

type SortField = "date" | "price";
type SortOrder = "asc" | "desc";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const checkSessionAndFetchOrders = async () => {
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        router.replace("/sign-in");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${session.user.id}`,
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

  const sortedOrders = useMemo(() => {
    const sorted = [...orders];
    sorted.sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc"
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice;
      }
    });
    return sorted;
  }, [orders, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

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
    <div className="min-h-screen bg-neutral-100 px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-black">My Orders</h1>

          {/* Sort Controls */}
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => toggleSort("date")}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-colors ${
                sortField === "date"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            >
              Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => toggleSort("price")}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-colors ${
                sortField === "price"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            >
              Price {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-8 md:p-12 text-center">
            <div className="mb-4 text-gray-300">
              <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">Your orders will appear here</p>
            <button
              onClick={() => router.push("/shop")}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors font-medium text-sm md:text-base"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-4 md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3 md:mb-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-black">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl md:text-2xl font-bold text-black">
                      ${order.totalPrice}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">{order.address}</p>
                  </div>
                </div>

                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-100 pt-3 md:pt-4">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
                        Items
                      </h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 md:gap-3 bg-gray-50 rounded-lg px-3 md:px-4 py-2"
                          >
                            {item.productImage && (
                              <div className="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                                <Image
                                  src={`http://localhost:8000${item.productImage}`}
                                  alt={item.productName || `Product ${item.productId}`}
                                  fill
                                  unoptimized
                                  className="object-contain rounded"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-black font-medium text-xs md:text-sm truncate block">
                                {item.productName || `Product #${item.productId}`}
                              </span>
                              {item.productPrice && (
                                <span className="text-gray-600 text-xs">
                                  ${item.productPrice}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-600 text-xs md:text-sm flex-shrink-0">
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
