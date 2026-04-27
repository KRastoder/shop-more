"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession();

      if (data?.user) {
        router.replace("/");
      } else {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    setSuccessMsg("Welcome back 👋");

    setTimeout(() => {
      router.replace("/"); // better than push
    }, 800);

    setLoading(false);

    console.log(data);
  };

  // ⛔ Prevent UI flicker while checking session
  if (checkingAuth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-black">
          Sign in
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/80"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/80"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
