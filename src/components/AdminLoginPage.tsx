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
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-96 space-y-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-xl font-bold">Admin Portal</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded bg-teal-600 p-2 text-white"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}