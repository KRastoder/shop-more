"use client";

import Link from "next/link";
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4 py-8">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="text-black w-full border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="text-black w-full border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}
          {successMsg && <p className="text-sm text-green-600 text-center">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-900 active:bg-gray-950 transition-all disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-black font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
