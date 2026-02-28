import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUserByAdmin } from "../store/slices/user.slice";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { updateUserByAdmin } from "../../store/slices/user.slice";

export default function AdminUserEdit() {
  const { id } = useParams();
  const userId = Number(id);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const selectedUser = useAppSelector((state) =>
    state.adminUser.list.find((u) => u.id === userId),
  );

  useEffect(() => {
    if (!selectedUser) {
      navigate("/admin/users");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(selectedUser.name);
    setPhoneNumber(selectedUser.phoneNumber || "");
  }, [selectedUser, navigate]);

  const handleSave = async () => {
    setFormError(null);

    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }

    const result = await dispatch(
      updateUserByAdmin({
        id: userId,
        name,
        phoneNumber,
      }),
    );

    if (updateUserByAdmin.fulfilled.match(result)) {
      navigate("/admin/users");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Edit User</h1>
          <p className="text-xs text-slate-500">
            Update employee basic information.
          </p>
        </header>

        {/* Error */}
        {(error || formError) && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 space-y-1">
            {error && <p>{error}</p>}
            {formError && <p>{formError}</p>}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4 rounded-lg bg-white border border-slate-200 p-4 shadow-sm"
        >
          {/* Name */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-slate-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Employee name"
            />
          </div>

          {/* Phone Number */}
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
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="e.g. 08123456789"
            />
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
