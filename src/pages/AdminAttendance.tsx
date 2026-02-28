import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllAttendance } from "../store/slices/adminAttendance.slice";

export default function AdminAttendance() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(
    (state) => state.adminAttendance,
  );

  useEffect(() => {
    dispatch(fetchAllAttendance());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Attendance List
          </h1>
          <p className="text-xs text-slate-500">
            View employee attendance records
          </p>
        </header>

        {/* States */}
        {loading && (
          <p className="text-xs text-slate-500">Loading attendance...</p>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Table Card */}
        <div className="overflow-x-auto rounded-lg bg-white border border-slate-200 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Check In</th>
                <th className="px-4 py-3 text-left font-medium">Check Out</th>
              </tr>
            </thead>

            <tbody>
              {list.map((a, idx) => (
                <tr
                  key={a.id}
                  className={`border-t border-slate-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-slate-100 transition`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {a.user?.name || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-700">{a.date}</td>

                  <td className="px-4 py-3 text-slate-700">
                    {a.checkInTime || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {a.checkOutTime || "-"}
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
