import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import {
  checkIn,
  checkOut,
  fetchMyAttendance,
} from "../store/slices/attendance.slice.ts";

type Attendance = {
  id: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
};

export default function Attendance() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.attendance);
  const data = list as Attendance[];
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    dispatch(fetchMyAttendance());
  }, [dispatch]);

  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = data?.find((item) => item.date === today);

  const canCheckIn = !todayAttendance;
  const canCheckOut =
    !!todayAttendance &&
    !!todayAttendance.checkInTime &&
    !todayAttendance.checkOutTime;

  const handleCheckIn = async () => {
    try {
      setActionError(null);
      setActionLoading(true);
      await dispatch(checkIn()).unwrap();
      await dispatch(fetchMyAttendance());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || "Failed to check in. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionError(null);
      setActionLoading(true);
      await dispatch(checkOut()).unwrap();
      await dispatch(fetchMyAttendance());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          "Failed to check out. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    dispatch(fetchMyAttendance(undefined));
  };

  const handleSearch = () => {
    if (!fromDate || !toDate) return;

    dispatch(
      fetchMyAttendance({
        from: fromDate,
        to: toDate,
      }),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6 text-center space-y-2">
          <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-600">Loading your attendance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-red-200 rounded-lg shadow-sm p-6 space-y-2">
          <p className="text-sm font-medium text-red-700">
            Something went wrong
          </p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            My Attendance
          </h1>
          <span className="text-xs text-slate-500">
            Overview of your daily logs
          </span>
        </header>

        {/* Filter Date */}
        <div className="rounded-lg bg-white border border-slate-200 p-4 shadow-sm">
          <header className="mb-3 space-y-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Filter Date
            </h2>
            <p className="text-xs text-slate-500">
              Select date range to filter attendance
            </p>
          </header>

          <div className="flex flex-wrap items-end gap-3">
            {/* From */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-700">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate || undefined}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            {/* To */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-slate-700">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || undefined}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 sm:pt-0">
              <button
                onClick={handleSearch}
                disabled={!fromDate || !toDate}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cari
              </button>

              <button
                onClick={handleReset}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            Use the buttons to check in when you start and check out when you
            finish your day.
          </div>
          <div className="flex gap-2">
            {canCheckIn && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                {actionLoading ? "Checking In..." : "Check In"}
              </button>
            )}
            {canCheckOut && (
              <button
                type="button"
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                {actionLoading ? "Checking Out..." : "Check Out"}
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {actionError}
          </div>
        )}

        {data?.length === 0 && (
          <div className="bg-white border border-dashed border-slate-200 rounded-lg p-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              No attendance records yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Your check-in and check-out history will appear here.
            </p>
          </div>
        )}

        {data?.length > 0 && (
          <ul className="space-y-3">
            {data?.map((item) => (
              <li
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-3 text-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="text-slate-900 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <span className="text-xs rounded-full bg-slate-100 text-slate-600 px-2 py-0.5">
                    Daily record
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Check-in
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {item.checkInTime ? (
                        new Date(
                          item.date + " " + item.checkInTime,
                        ).toLocaleTimeString()
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Check-out
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {item.checkOutTime ? (
                        new Date(
                          item.date + " " + item.checkOutTime,
                        ).toLocaleTimeString()
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
