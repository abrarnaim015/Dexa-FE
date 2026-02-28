import type { AuditLog } from "../store/slices/auditLog.slice";

export function groupNewLogs(logs: AuditLog[]) {
  const attendance: AuditLog[] = [];
  const profile: AuditLog[] = [];

  logs.forEach((log) => {
    if (
      log.action === "ATTENDANCE_CHECK_IN" ||
      log.action === "ATTENDANCE_CHECK_OUT"
    ) {
      attendance.push(log);
    }

    if (log.action === "USER_PROFILE_UPDATED") {
      profile.push(log);
    }
  });

  return { attendance, profile };
}
