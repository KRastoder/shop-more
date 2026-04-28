import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();

  const res = await fetch("http://localhost:8000/api/auth/get-session", {
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) return null;

  return res.json();
}
