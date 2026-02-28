import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { fetchMe, resertUpdateStatus } from "../store/slices/user.slice.ts";

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { me, loading, isUpdateSuccess } = useAppSelector(
    (state) => state.user,
  );

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setTimeout(() => {
        dispatch(resertUpdateStatus());
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  if (loading || !me) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <p className="text-sm text-slate-600">Loading profile...</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = me?.data as any;

  const avatarUrl = data?.profile_photo_url || "/avatar.png";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {isUpdateSuccess && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 space-y-1">
            <p>Update Successful</p>
          </div>
        )}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
          <p className="text-xs text-slate-500">
            View your account information.
          </p>
        </header>

        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-28 w-28 rounded-full object-cover border border-slate-200 mb-2"
          />
          <button
            onClick={() => navigate("/profile/update/photo")}
            className="text-sm text-blue-600"
          >
            Edit Photo
          </button>
        </div>

        <div className="rounded-lg bg-white border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase">Name</p>
            <p className="text-sm text-slate-900">{data.name ?? "-"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase">
              Email
            </p>
            <p className="text-sm text-slate-900">{data.email ?? "-"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase">Role</p>
            <p className="text-sm text-slate-900">{data.role ?? "-"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase">
              Phone Number
            </p>
            {/* <p className="text-sm text-slate-900">{data.phoneNumber ?? "-"}</p> */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-900">
                {data.phoneNumber || "-"}
              </p>

              <button
                onClick={() => navigate("/profile/update/phone")}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase">
              Position
            </p>
            <p className="text-sm text-slate-900">{data.position ?? "-"}</p>
          </div>
        </div>

        <button
          type="button"
          disabled={isUpdateSuccess}
          onClick={() => navigate("/profile/update/password")}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          Change Password
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/attendance")}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Back to Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
