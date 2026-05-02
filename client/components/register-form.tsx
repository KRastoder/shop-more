"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await authClient.signUp.email({
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
    setLoading(false);
    setTimeout(() => router.replace("/"), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4 py-8">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">Join us and start shopping</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              placeholder="Name"
              className="text-black w-full border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              placeholder="Email"
              className="text-black w-full border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
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
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-black font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
