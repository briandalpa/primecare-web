import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      alert(result.error.message);
      return;
    }

    const session = await authClient.getSession();

    const role = session.data?.user?.role;

    if (role === "SUPER_ADMIN") {
      navigate("/superadmin/dashboard");
    } else if (role === "OUTLET_ADMIN") {
      navigate("/admin/dashboard");
    } else {
      alert("Unauthorized admin");
    }
  }

  return (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="w-[420px] rounded-2xl bg-white p-8 shadow-lg">

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 text-white text-sm font-bold">
          PC
        </div>
        <span className="text-2xl font-semibold text-teal-600">
          PrimeCare
        </span>
      </div>

      {/* Admin Portal */}
      <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
        <span>🛡️</span>
        <span className="text-sm font-medium">ADMIN PORTAL</span>
      </div>

      {/* Title */}
      <h1 className="text-center text-2xl font-bold mb-2">
        Admin Sign In
      </h1>

      <p className="text-center text-gray-500 mb-6">
        Access the management dashboard
      </p>

      <form onSubmit={handleLogin} className="space-y-4">

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="admin@primecare.com"
            className="mt-1 w-full rounded-lg border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 py-2 text-white font-medium hover:bg-teal-700"
        >
          Sign In
        </button>

      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Not an admin?{" "}
        <a href="/" className="text-teal-600 hover:underline">
          Customer Login
        </a>
      </p>

    </div>
  </div>
);
}