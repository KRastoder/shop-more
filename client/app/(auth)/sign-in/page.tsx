import { authClient } from "@/lib/auth-client";
import LoginForm from "../../../components/login-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await authClient.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main>
      <LoginForm />
    </main>
  );
}
