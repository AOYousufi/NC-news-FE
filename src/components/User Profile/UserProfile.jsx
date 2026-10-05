import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";

function UserProfile() {
  const { loggedUser, isAuthLoading, updateProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (loggedUser) {
      setName(loggedUser.name || "");
      setAvatarUrl(loggedUser.avatar_url || "");
    }
  }, [loggedUser]);

  if (isAuthLoading || !loggedUser) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile({
        name: name.trim(),
        avatar_url: avatarUrl.trim(),
      });
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const initial = (loggedUser.name || loggedUser.username || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        <div className="bg-slate-950 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {loggedUser.avatar_url ? (
              <img
                src={loggedUser.avatar_url}
                alt=""
                className="h-24 w-24 rounded-2xl border-4 border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600 text-4xl font-black">
                {initial}
              </div>
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-300">
                Your profile
              </p>
              <h1 className="mt-2 text-4xl font-black">{loggedUser.name}</h1>
              <p className="mt-1 text-slate-300">@{loggedUser.username}</p>
            </div>
          </div>
        </div>

        <form className="grid gap-5 p-6 sm:p-10" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-xl font-black text-slate-950">Profile details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your username stays fixed. You can update your display name and
              avatar.
            </p>
          </div>

          <label>
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">Avatar URL</span>
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          {message && (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </p>
          )}
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-fit rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default UserProfile;
