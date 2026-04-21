import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [email, setEmail] = useState("admin@industrial.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = login(email, password);

    if (!success) {
      setError("Invalid email or password.");
      return;
    }

    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-500 dark:text-cyan-400">
            Industrial Monitoring Platform
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Access your industrial command center.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@industrial.com"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:text-rose-400">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Sign In
          </button>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            Demo credentials: admin@industrial.com / admin123
          </div>
        </form>
      </div>
    </div>
  );
}