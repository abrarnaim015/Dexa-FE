import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface AuditLog {
  id: number;
  action: string;
  newValue: string | null;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface AuditLogState {
  list: AuditLog[];
  loading: boolean;
  error: string | null;
}

const initialState: AuditLogState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchAuditLogs = createAsyncThunk(
  "auditLog/fetchAuditLogs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/audit-logs");
      return res.data.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch audit logs",
      );
    }
  },
);

const auditLogSlice = createSlice({
  name: "auditLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default auditLogSlice.reducer;
