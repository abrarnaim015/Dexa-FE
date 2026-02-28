import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  registerEmployee,
  clearRegisterState,
} from "../store/slices/adminRegister.slice";

export default function AdminRegister() {
  const dispatch = useAppDispatch();
  const { loading, error, successUser } = useAppSelector(
    (state) => state.adminRegister,
  );

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // FE validation error
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (successUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName("");
      setEmail("");
      setPassword("");
      setFormError(null);
    }
  }, [successUser]);

  // clear redux state when leaving page
  useEffect(() => {
    return () => {
      dispatch(clearRegisterState());
    };
  }, [dispatch]);

  const isValidPassword = (value: string) => {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    return value.length >= 6 && hasLetter && hasNumber;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // FE validation
    if (!name || !email || !password) {
      setFormError("Name, email, and password are required");
      return;
    }

    if (!email.includes("@")) {
      setFormError("Invalid email format");
      return;
    }

    if (!isValidPassword(password)) {
      setFormError(
        "Password must be at least 6 characters and contain letters and numbers",
      );
      return;
    }

    dispatch(
      registerEmployee({
        name,
        email,
        password,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Register Employee
          </h1>
          <p className="text-xs text-slate-500">Admin only</p>
        </header>

        {/* Error Box */}
        {(formError || error) && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 space-y-1">
            {formError && <p>{formError}</p>}
            {error && <p>{error}</p>}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg bg-white border border-slate-200 p-4 shadow-sm"
        >
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Employee name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@email.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 chars, letters & numbers"
            />
          </div>

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Success Result */}
        {successUser && (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-sm shadow-sm space-y-1">
            <p className="font-medium text-slate-900">
              User registered successfully
            </p>
            <p className="text-slate-700">Name: {successUser.name}</p>
            <p className="text-slate-700">Email: {successUser.email}</p>
            <p className="text-slate-700">Role: {successUser.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}
