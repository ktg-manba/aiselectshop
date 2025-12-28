"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok && active) {
          router.replace("/admin");
        }
      } catch {
        // Ignore auth checks.
      }
    }
    checkSession();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setMessage(payload.error || "Request failed.");
        return;
      }
      router.push("/admin");
    } catch (error) {
      setMessage("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] grid md:grid-cols-2">
          <div className="bg-[#002FA7] text-white p-8 flex flex-col justify-between">
            <div className="text-sm font-mono">admin_login</div>
            <div>
              <div className="font-display text-3xl font-bold">AI Select Shop</div>
              <div className="text-sm text-blue-100 mt-2">Boutique control room.</div>
            </div>
            <div className="text-xs text-blue-100">Klein Blue Admin</div>
          </div>
          <div className="p-8 space-y-4">
            <div>
              <div className="font-display text-2xl font-bold">
                {mode === "login" ? "Sign in" : "Create admin"}
              </div>
              <div className="text-sm text-gray-500">
                {mode === "login" ? "Admin access only." : "Create your first admin user."}
              </div>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {mode === "register" && (
                <input
                  className="w-full rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  placeholder="Name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              )}
              <input
                className="w-full rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className="w-full rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {message && <div className="text-xs text-red-500">{message}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002FA7] text-white rounded-full py-2 text-sm disabled:opacity-60"
              >
                {loading ? "Processing..." : mode === "login" ? "Login" : "Register"}
              </button>
            </form>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[#002FA7]"
              >
                {mode === "login" ? "Create admin" : "Back to login"}
              </button>
              <Link href="/" className="text-[#002FA7]">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
