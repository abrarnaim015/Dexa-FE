import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { decodeJwt } from "../utils/jwt";
import Header from "../components/Header.tsx";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: "ADMIN" | "EMPLOYEE";
}) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = decodeJwt(token);

  if (!payload) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && payload.role !== requiredRole) {
    return <Navigate to="/attendance" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
