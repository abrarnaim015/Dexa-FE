import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice.ts";
import attendanceReducer from "./slices/attendance.slice.ts";
import userReducer from "./slices/user.slice.ts";
import adminUserReducer from "./slices/adminUser.slice";
import adminAttendanceReducer from "./slices/adminAttendance.slice";
import adminRegisterReducer from "./slices/adminRegister.slice";
import auditLogReducer from "./slices/auditLog.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    user: userReducer,
    adminUser: adminUserReducer,
    adminAttendance: adminAttendanceReducer,
    adminRegister: adminRegisterReducer,
    auditLog: auditLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
