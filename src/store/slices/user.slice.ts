import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

type UserMe = {
  phoneNumber?: string;
  [key: string]: unknown;
  data?: {
    profile_photo_url?: string;
  };
};

interface UserState {
  me: UserMe | null;
  loading: boolean;
  error: string | null;
  isUpdateSuccess: boolean;
}

interface UpdateMePayload {
  phoneNumber?: string;
  oldPassword?: string;
  newPassword?: string;
}

const initialState: UserState = {
  me: null,
  loading: false,
  error: null,
  isUpdateSuccess: false,
};

export const fetchMe = createAsyncThunk<UserMe, void, { rejectValue: string }>(
  "user/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<UserMe>("/users/me");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load profile.";
      return rejectWithValue(message);
    }
  },
);

export const updateMe = createAsyncThunk<
  void,
  UpdateMePayload,
  { rejectValue: string }
>("user/updateMe", async (payload, { rejectWithValue }) => {
  try {
    const body: UpdateMePayload = {};

    if (payload.phoneNumber !== undefined) {
      body.phoneNumber = payload.phoneNumber;
    }

    if (payload.oldPassword !== undefined) {
      body.oldPassword = payload.oldPassword;
    }

    if (payload.newPassword !== undefined) {
      body.newPassword = payload.newPassword;
    }

    await api.put("/users/me", body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update profile.";
    return rejectWithValue(message);
  }
});

export const removeProfilePhoto = createAsyncThunk(
  "user/removeProfilePhoto",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete<UserMe>("/users/me/photo");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to Remove Profile Photo.";
      return rejectWithValue(message);
    }
  },
);

export const updateProfilePhoto = createAsyncThunk(
  "user/updateProfilePhoto",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await api.put("/users/me/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data; // { success: true }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update profile photo",
      );
    }
  },
);

export const updateUserByAdmin = createAsyncThunk(
  "user/updateUserByAdmin",
  async (
    payload: { id: number; name: string; phoneNumber: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.put(`/users/${payload.id}`, {
        name: payload.name,
        phoneNumber: payload.phoneNumber,
      });

      return res.data.data; // updated user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update user",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resertUpdateStatus(state) {
      state.isUpdateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<UserMe>) => {
        state.loading = false;
        state.me = action.payload;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load profile.";
      })
      .addCase(updateMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state) => {
        state.loading = false;
        state.isUpdateSuccess = true;
        state.error = null;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile.";
      })
      .addCase(updateProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePhoto.fulfilled, (state) => {
        state.loading = false;
        state.isUpdateSuccess = true;
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProfilePhoto.fulfilled, (state) => {
        state.loading = false;
        state.isUpdateSuccess = true;
      })
      .addCase(removeProfilePhoto.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to update profile photo";
      })
      .addCase(updateUserByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserByAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isUpdateSuccess = true;
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resertUpdateStatus } = userSlice.actions;
export default userSlice.reducer;
