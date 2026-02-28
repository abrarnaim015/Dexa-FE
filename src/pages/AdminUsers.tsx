import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers } from "../store/slices/adminUser.slice";
import { useNavigate } from "react-router-dom";
import { resertUpdateStatus } from "../store/slices/user.slice";

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useAppSelector((state) => state.adminUser);
  const { isUpdateSuccess } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setTimeout(() => {
        dispatch(resertUpdateStatus());
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">User List</h1>
          <p className="text-xs text-slate-500">Manage registered employees</p>
        </header>

        {/* Alerts */}
        {loading && <p className="text-xs text-slate-500">Loading users...</p>}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {isUpdateSuccess && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            Update successful
          </div>
        )}

        {/* Table Card */}
        <div className="overflow-x-auto rounded-lg bg-white border border-slate-200 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`border-t border-slate-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-slate-100 transition`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{u.name}</p>
                  </td>

                  <td className="px-4 py-3 text-slate-700">{u.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
