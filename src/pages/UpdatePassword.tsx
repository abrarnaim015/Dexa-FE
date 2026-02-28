import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { fetchMe, updateMe } from "../store/slices/user.slice.ts";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { me, loading, error, isUpdateSuccess } = useAppSelector(
    (state) => state.user,
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (isUpdateSuccess) navigate("/profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const trimmedOldPassword = oldPassword.trim();
  const trimmedNewPassword = newPassword.trim();

  const hasOldPassword = trimmedOldPassword.length > 0;
  const hasNewPassword = trimmedNewPassword.length > 0;

  const isDirty = hasOldPassword || hasNewPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!isDirty) {
      setFormError("No changes to save.");
      return;
    }

    if (
      (hasOldPassword && !hasNewPassword) ||
      (!hasOldPassword && hasNewPassword)
    ) {
      setFormError(
        "To change your password, please fill both current and new password.",
      );
      return;
    }

    const payload: {
      oldPassword?: string;
      newPassword?: string;
    } = {};

    if (hasOldPassword && hasNewPassword) {
      payload.oldPassword = trimmedOldPassword;
      payload.newPassword = trimmedNewPassword;
    }

    try {
      setSubmitting(true);
      await dispatch(updateMe(payload)).unwrap();
      await dispatch(fetchMe());
      setOldPassword("");
      setNewPassword("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !me) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6 text-center space-y-2">
          <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Update Profile
          </h1>
          <p className="text-xs text-slate-500">Update your password.</p>
        </header>

        {(error || formError) && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 space-y-1">
            {error && <p>{error}</p>}
            {formError && <p>{formError}</p>}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg bg-white border border-slate-200 p-4 shadow-sm"
        >
          <div className="space-y-1">
            <label
              htmlFor="oldPassword"
              className="block text-xs font-medium text-slate-700"
            >
              Current Password
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="newPassword"
              className="block text-xs font-medium text-slate-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            disabled={!isDirty || submitting}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-slate-800"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
