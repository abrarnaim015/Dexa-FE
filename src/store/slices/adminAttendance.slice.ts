import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchAllAttendance = createAsyncThunk(
  "adminAttendance/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/attendance");
      return res.data; // array attendance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch attendance",
      );
    }
  },
);

type AdminAttendanceState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any[];
  loading: boolean;
  error: string | null;
};

const initialState: AdminAttendanceState = {
  list: [],
  loading: false,
  error: null,
};

const adminAttendanceSlice = createSlice({
  name: "adminAttendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminAttendanceSlice.reducer;
