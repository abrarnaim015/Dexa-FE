import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { getAndSetRole, logout } from "../store/slices/auth.slice.ts";
import MobileNavButton from "./MobileNavButton.tsx";
import NavButton from "./NavButton.tsx";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.role);
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const isAdmin = role === "ADMIN";
  const isAdminUsersPage = location.pathname === "/admin/users";

  const adminNav = isAdmin
    ? isAdminUsersPage
      ? {
          label: "Attendance List",
          to: "/admin/attendance",
        }
      : {
          label: "Users List",
          to: "/admin/users",
        }
    : null;

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!role) {
      dispatch(getAndSetRole());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-sm font-semibold tracking-tight text-slate-900">
            Dexa Attendance
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* === existing buttons, TIDAK diubah logicnya === */}
            {role === "EMPLOYEE" && location.pathname !== "/profile" && (
              <NavButton onClick={() => navigate("/profile")}>
                Profile
              </NavButton>
            )}

            {role === "ADMIN" && location.pathname !== "/admin/register" && (
              <NavButton onClick={() => navigate("/admin/register")}>
                Register
              </NavButton>
            )}

            {role === "ADMIN" && location.pathname !== "/admin/audit-logs" && (
              <NavButton onClick={() => navigate("/admin/audit-logs")}>
                Activity Logs
              </NavButton>
            )}

            {adminNav && (
              <NavButton onClick={() => navigate(adminNav.to)}>
                {adminNav.label}
              </NavButton>
            )}

            <NavButton variant="outline" onClick={handleLogout}>
              Logout
            </NavButton>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="mt-3 space-y-2 md:hidden">
            {role === "EMPLOYEE" && location.pathname !== "/profile" && (
              <MobileNavButton
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
              >
                Profile
              </MobileNavButton>
            )}

            {role === "ADMIN" && location.pathname !== "/admin/register" && (
              <MobileNavButton
                onClick={() => {
                  navigate("/admin/register");
                  setOpen(false);
                }}
              >
                Register
              </MobileNavButton>
            )}

            {role === "ADMIN" && location.pathname !== "/admin/audit-logs" && (
              <MobileNavButton
                onClick={() => {
                  navigate("/admin/audit-logs");
                  setOpen(false);
                }}
              >
                Activity Logs
              </MobileNavButton>
            )}

            {adminNav && (
              <MobileNavButton
                onClick={() => {
                  navigate(adminNav.to);
                  setOpen(false);
                }}
              >
                {adminNav.label}
              </MobileNavButton>
            )}

            <MobileNavButton
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              danger
            >
              Logout
            </MobileNavButton>
          </div>
        )}
      </div>
    </header>
  );

  // return (
  //   <header className="w-full border-b border-slate-200 bg-white">
  //     <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 gap-4">
  //       <div className="text-sm font-semibold tracking-tight text-slate-900">
  //         Dexa Attendance
  //       </div>
  //       <div className="flex items-center gap-2">
  //         {role === "EMPLOYEE" && location.pathname !== "/profile" && (
  //           <button
  //             type="button"
  //             onClick={() => navigate("/profile")}
  //             className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
  //           >
  //             Profile
  //           </button>
  //         )}
  //         {role === "ADMIN" && location.pathname !== "/admin/register" && (
  //           <button
  //             onClick={() => navigate("/admin/register")}
  //             className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
  //           >
  //             Register
  //           </button>
  //         )}
  //         {role === "ADMIN" && location.pathname !== "/admin/audit-logs" && (
  //           <button
  //             onClick={() => navigate("/admin/audit-logs")}
  //             className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
  //           >
  //             Activity Logs
  //           </button>
  //         )}
  //         {adminNav && (
  //           <button
  //             onClick={() => navigate(adminNav.to)}
  //             className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
  //           >
  //             {adminNav.label}
  //           </button>
  //         )}
  //         <button
  //           type="button"
  //           onClick={handleLogout}
  //           className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400"
  //         >
  //           Logout
  //         </button>
  //       </div>
  //     </div>
  //   </header>
  // );
}
