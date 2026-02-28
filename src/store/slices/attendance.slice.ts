/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

interface AttendanceState {
  list: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  list: [],
  loading: false,
  error: null,
};

// export const fetchMyAttendance = createAsyncThunk<
//   any[],
//   void,
//   { rejectValue: string }
// >("attendance/fetchMyAttendance", async (_, { rejectWithValue }) => {
//   try {
//     const response = await api.get<any[]>("/attendance/me");
//     return response.data;
//   } catch (error: any) {
// const message =
//   error?.response?.data?.message ||
//   error?.message ||
//   "Failed to load attendance.";
// return rejectWithValue(message);
//   }
// });

export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMyAttendance",
  async (
    params: { from?: string; to?: string } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const res = await api.get("/attendance/me", {
        params,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch attendance",
      );
    }
  },
);

export const checkIn = createAsyncThunk<void, void, { rejectValue: string }>(
  "attendance/checkIn",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/attendance/check-in");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to check in.";
      return rejectWithValue(message);
    }
  },
);

export const checkOut = createAsyncThunk<void, void, { rejectValue: string }>(
  "attendance/checkOut",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/attendance/check-out");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to check out.";
      return rejectWithValue(message);
    }
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyAttendance.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchMyAttendance.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load attendance.";
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.error = action.payload || "Failed to check in.";
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.error = action.payload || "Failed to check out.";
      });
  },
});

export default attendanceSlice.reducer;
