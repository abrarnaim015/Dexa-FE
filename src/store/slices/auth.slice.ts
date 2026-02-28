import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { decodeJwt } from "../../utils/jwt";

type Role = "ADMIN" | "EMPLOYEE";

interface AuthState {
  token: string | null;
  role: Role | null;
  userId: number | null;
  loading: boolean;
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface JwtPayload {
  userId: number;
  role: Role;
}

const initialState: AuthState = {
  token: null,
  role: null,
  userId: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { token: string; payload: JwtPayload },
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<{ data: { access_token: string } }>(
      "/auth/login",
      credentials,
    );
    const token = response?.data?.data?.access_token;
    localStorage.setItem("token", token);

    const [, payloadBase64] = token.split(".");
    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/"),
    );
    const payload = JSON.parse(payloadJson) as JwtPayload;

    return { token, payload };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to login. Please try again.";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      state.userId = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
    },
    getAndSetRole(state) {
      const token = localStorage.getItem("token");
      if (token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = decodeJwt(token);
        state.role = payload?.role;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{ token: string; payload: JwtPayload }>,
        ) => {
          state.loading = false;
          state.token = action.payload.token;
          state.userId = action.payload.payload.userId;
          state.role = action.payload.payload.role;
          state.error = null;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login.";
      });
  },
});

export const { logout, getAndSetRole } = authSlice.actions;
export default authSlice.reducer;
