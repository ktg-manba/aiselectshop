import Link from "next/link";

export default function AdminLoginPage() {
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
              <div className="font-display text-2xl font-bold">Sign in</div>
              <div className="text-sm text-gray-500">Admin access only.</div>
            </div>
            <input
              className="w-full rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Email"
              type="email"
            />
            <input
              className="w-full rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Password"
              type="password"
            />
            <button className="w-full bg-[#002FA7] text-white rounded-full py-2 text-sm">
              Login
            </button>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Forgot password?</span>
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
