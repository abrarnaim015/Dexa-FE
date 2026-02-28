import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAuditLogs } from "../store/slices/auditLog.slice";

const actionLabelMap: Record<string, string> = {
  USER_PROFILE_UPDATED: "User updated profile",
  ATTENDANCE_CHECK_IN: "Attendance check-in",
  ATTENDANCE_CHECK_OUT: "Attendance check-out",
};

export default function AdminAuditLogs() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.auditLog);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Activity Logs
          </h1>
          <p className="text-xs text-slate-500">
            Employee activity notifications
          </p>
        </header>

        {/* States */}
        {loading && <p className="text-xs text-slate-500">Loading logs...</p>}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-white border border-slate-200 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>

            <tbody>
              {list.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`border-t border-slate-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-slate-100 transition`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {log.user?.name || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {actionLabelMap[log.action] || log.action}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {!loading && list.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    No activity logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
