"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  "use server";
  const cookieStore = await cookies();
  const res = await fetch("http://localhost:8000/api/auth/sign-out", {
    method: "POST",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (res.ok) {
    const data = await res.json();
    const redirectUrl = data?.redirect || "/sign-in";
    redirect(redirectUrl);
  }
}
