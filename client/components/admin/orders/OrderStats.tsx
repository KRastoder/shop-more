import type { OrderStats as OrderStatsType } from "@/types/order";

type OrderStatsProps = {
  stats: OrderStatsType;
};

export default function OrderStats({ stats }: OrderStatsProps) {
  const statCards = [
    { label: "Total Orders", value: stats.total, color: "bg-white" },
    { label: "Pending", value: stats.pending, color: "bg-yellow-50" },
    { label: "Processing", value: stats.processing, color: "bg-blue-50" },
    { label: "Shipped", value: stats.shipped, color: "bg-purple-50" },
    { label: "Delivered", value: stats.delivered, color: "bg-green-50" },
    { label: "Cancelled", value: stats.cancelled, color: "bg-red-50" },
    { label: "This Month", value: `$${stats.thisMonthEarnings.toFixed(2)}`, color: "bg-emerald-50", isPrice: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-6 mb-8 md:mb-10">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.color} rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200`}
        >
          <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
          <p className="text-2xl md:text-4xl font-bold text-black mt-1 md:mt-2">
            {stat.isPrice ? stat.value : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
