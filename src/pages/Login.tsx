import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/slices/auth.slice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error, role, token } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  // redirect after login success
  useEffect(() => {
    if (token && role) {
      if (role === "ADMIN") navigate("/admin/register");
      else navigate("/attendance");
    }
  }, [token, role, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <header className="space-y-1 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Login</h1>
          <p className="text-xs text-slate-500">Sign in to continue</p>
        </header>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-lg bg-white border border-slate-200 p-6 shadow-sm"
        >
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
