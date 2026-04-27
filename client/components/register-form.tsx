"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || "Something went wrong");
      setLoading(false);
      return;
    }

    setSuccessMsg("Account created successfully 🎉");

    setTimeout(() => {
      router.replace("/"); // better UX than push
    }, 800);

    setLoading(false);

    console.log(data);
  };

  // ⛔ Prevent flicker while checking auth
  if (checkingAuth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-black">
          Create account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/80"
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            className="w-full bg-black rounded-lg py-2 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
