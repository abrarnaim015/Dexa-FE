import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type AdminRegisterState = {
  loading: boolean;
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  successUser: any | null;
};

const initialState: AdminRegisterState = {
  loading: false,
  error: null,
  successUser: null,
};

export const registerEmployee = createAsyncThunk(
  "adminRegister/registerEmployee",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", {
        ...payload,
        role: "EMPLOYEE",
      });
      return res.data.data; // user object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to register employee",
      );
    }
  },
);

const adminRegisterSlice = createSlice({
  name: "adminRegister",
  initialState,
  reducers: {
    clearRegisterState(state) {
      state.loading = false;
      state.error = null;
      state.successUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successUser = null;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successUser = action.payload;
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRegisterState } = adminRegisterSlice.actions;
export default adminRegisterSlice.reducer;
