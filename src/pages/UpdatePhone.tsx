import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { fetchMe, updateMe } from "../store/slices/user.slice.ts";
import { useNavigate } from "react-router-dom";

export default function UpdatePhone() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { me, loading, error, isUpdateSuccess } = useAppSelector(
    (state) => state.user,
  );

  const [phoneNumber, setPhoneNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    const currentPhone =
      (me && typeof me === "object" && "phoneNumber" in me
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (me as any).phoneNumber
        : "") ?? "";
    setPhoneNumber(currentPhone);
  }, [me]);

  useEffect(() => {
    if (isUpdateSuccess) navigate("/profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const originalPhone =
    (me && typeof me === "object" && "phoneNumber" in me
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (me as any).phoneNumber
      : "") ?? "";

  const isPhoneChanged = phoneNumber !== originalPhone;
  const isDirty = isPhoneChanged;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!isDirty) {
      setFormError("No changes to save.");
      return;
    }

    const payload: {
      phoneNumber?: string;
    } = {};

    if (isPhoneChanged) {
      payload.phoneNumber = phoneNumber;
    }

    try {
      setSubmitting(true);
      await dispatch(updateMe(payload)).unwrap();
      await dispatch(fetchMe());
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

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, ""); // numeric only
    const limited = digits.slice(0, 15); // max 15 digit

    return limited.match(/.{1,4}/g)?.join("-") || "";
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
          <p className="text-xs text-slate-500">
            Update your contact information.
          </p>
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
              htmlFor="phoneNumber"
              className="block text-xs font-medium text-slate-700"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setPhoneNumber(formatted);
              }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="e.g. 0812-3456-7890"
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
