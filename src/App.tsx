import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import AdminRegister from "./pages/AdminRegister";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import UpdatePhone from "./pages/UpdatePhone";
import UpdatePassword from "./pages/UpdatePassword";
import AdminUsers from "./pages/AdminUsers";
import AdminAttendance from "./pages/AdminAttendance";
import ProfileUpdatePhoto from "./pages/ProfileUpdatePhoto";
import AdminUserEdit from "./pages/AdminUserEdit";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import { useAppSelector } from "./store/hooks";
import AdminNotifier from "./components/AdminNotifier";

function App() {
  const { role } = useAppSelector((state) => state.auth);
  return (
    <BrowserRouter>
      {/* ✅ ADMIN NOTIFIER — GLOBAL */}
      {role === "ADMIN" && <AdminNotifier />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/register"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminRegister />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update/phone"
          element={
            <ProtectedRoute>
              <UpdatePhone />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update/password"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update/photo"
          element={
            <ProtectedRoute>
              <ProfileUpdatePhoto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id/edit"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUserEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminAuditLogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
