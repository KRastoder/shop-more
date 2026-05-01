import { authClient } from "@/lib/auth-client";
import LoginForm from "../../../components/login-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const { data: session } = await authClient.getSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main>
      <LoginForm />
    </main>
  );
}
