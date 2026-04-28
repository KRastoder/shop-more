import CreateProductForm from "@/components/admin/CreateProductForm";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return (
    <div>
      <h1>admin page</h1>
      <p>Welcome, {session.user.name}</p>
      <CreateProductForm />
    </div>
  );
}
