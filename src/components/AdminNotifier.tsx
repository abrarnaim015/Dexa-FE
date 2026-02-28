import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAuditLogs } from "../store/slices/auditLog.slice";
import { getLastSeen, setLastSeen } from "../utils/auditLastSeen";
import { groupNewLogs } from "../utils/groupAuditLogs";
import { getPollingInterval } from "../utils/pollingInterval";

export default function AdminNotifier() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { role } = useAppSelector((state) => state.auth);
  const { list } = useAppSelector((state) => state.auditLog);

  useEffect(() => {
    if (role !== "ADMIN") return;
    if (location.pathname === "/login") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      await dispatch(fetchAuditLogs());

      const lastSeen = getLastSeen();
      if (!lastSeen) {
        if (list.length > 0) {
          setLastSeen(list[0].createdAt);
        }
        scheduleNext();
        return;
      }

      const newLogs = list.filter(
        (log) => new Date(log.createdAt) > new Date(lastSeen),
      );

      if (newLogs.length === 0) {
        scheduleNext();
        return;
      }

      const { attendance, profile } = groupNewLogs(newLogs);

      // 🔔 Attendance toast
      if (attendance.length > 0) {
        toast.info(
          <div>
            <p className="font-medium mb-1">Attendance Activity</p>
            {attendance.slice(0, 3).map((log) => (
              <p key={log.id} className="text-xs">
                • {log.user?.name} —{" "}
                {log.action === "ATTENDANCE_CHECK_IN"
                  ? "Check In"
                  : "Check Out"}
              </p>
            ))}
            {attendance.length > 3 && (
              <p className="text-xs">+{attendance.length - 3} others</p>
            )}
          </div>,
          {
            onClick: () => navigate("/admin/audit-logs"),
            style: { cursor: "pointer" },
          },
        );
      }

      // 🔔 Profile update toast
      if (profile.length > 0) {
        toast.info(
          <div>
            <p className="font-medium mb-1">Profile Updated</p>
            {profile.slice(0, 3).map((log) => (
              <p key={log.id} className="text-xs">
                • {log.user?.name} updated profile
              </p>
            ))}
            {profile.length > 3 && (
              <p className="text-xs">+{profile.length - 3} others</p>
            )}
          </div>,
          {
            onClick: () => navigate("/admin/audit-logs"),
            style: { cursor: "pointer" },
          },
        );
      }

      // update last seen
      setLastSeen(newLogs[0].createdAt);

      scheduleNext();
    };

    const scheduleNext = () => {
      timeoutId = setTimeout(poll, getPollingInterval());
    };

    poll();

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, role, location.pathname, navigate]);

  return null;
}
