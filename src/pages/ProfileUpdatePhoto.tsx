import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updateProfilePhoto,
  fetchMe,
  removeProfilePhoto,
} from "../store/slices/user.slice";

export default function ProfileUpdatePhoto() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { me, loading, error } = useAppSelector((state) => state.user);
  console.log(me, "<<<<<");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const currentAvatar = me?.data?.profile_photo_url || "/avatar.png";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFormError(null);

    if (!selectedFile) return;

    // validation
    if (selectedFile.type !== "image/png") {
      setFormError("Only PNG images are allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFormError("Image size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    if (!file) {
      setFormError("Please select an image");
      return;
    }

    const result = await dispatch(updateProfilePhoto(file));

    if (updateProfilePhoto.fulfilled.match(result)) {
      await dispatch(fetchMe());
      navigate("/profile");
    }
  };

  const handleRemovePhoto = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile photo?",
    );

    if (!confirmed) return;

    const result = await dispatch(removeProfilePhoto());

    if (removeProfilePhoto.fulfilled.match(result)) {
      await dispatch(fetchMe());
      navigate("/profile");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold mb-4">Update Profile Photo</h1>

      <div className="flex flex-col items-center gap-4">
        <img
          src={preview || currentAvatar}
          alt="Profile"
          className="h-32 w-32 rounded-full object-cover border border-slate-200"
        />
        <input
          id="profile-photo"
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="profile-photo"
          className="cursor-pointer rounded-md border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          Choose PNG Photo
        </label>
        {file && (
          <p className="mt-1 text-xs text-slate-500">Selected: {file.name}</p>
        )}
      </div>

      {formError && (
        <p className="mt-3 text-sm text-red-500 text-center">{formError}</p>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Photo"}
      </button>

      {me?.data?.profile_photo_url && (
        <button
          onClick={handleRemovePhoto}
          disabled={loading}
          className="mt-3 w-full rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          Remove Photo
        </button>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={() => navigate("/profile")}
        className="mt-6 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
      >
        Cancel
      </button>
    </div>
  );
}
