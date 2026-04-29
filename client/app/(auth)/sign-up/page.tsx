import { redirect } from "next/navigation";
import RegisterForm from "../../../components/register-form";
import { getSession } from "@/lib/get-session";

export default async function Page() {
  const session = await getSession();

  if (session?.user) redirect("/");
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
