import AdminHeader from "@/components/admin/AdminHeader";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      {children}
    </div>
  );
}
