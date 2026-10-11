import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import { fetchArticles } from "../../api/api";
import Avatar from "../UI/Avatar";
import AvatarPicker from "../UI/AvatarPicker";

function UserProfile() {
  const { loggedUser, isAuthLoading, updateProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [pinnedArticleId, setPinnedArticleId] = useState("");
  const [ownArticles, setOwnArticles] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser) return;

    setName(loggedUser.name || "");
    setAvatarUrl(loggedUser.avatar_url || "");
    setBio(loggedUser.bio || "");
    setPinnedArticleId(
      loggedUser.pinned_article_id
        ? String(loggedUser.pinned_article_id)
        : ""
    );

    fetchArticles({
      author: loggedUser.username,
      sort_by: "created_at",
      order: "desc",
    })
      .then(setOwnArticles)
      .catch(() => setOwnArticles([]));
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

    if (bio.length > 500) {
      setError("Bio must be 500 characters or fewer.");
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile({
        name: name.trim(),
        avatar_url: avatarUrl.trim(),
        bio: bio.trim(),
        pinned_article_id: pinnedArticleId
          ? Number(pinnedArticleId)
          : null,
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar
              user={{ ...loggedUser, name, avatar_url: avatarUrl }}
              size="lg"
              className="border-4 border-white/15 shadow-xl"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-200">
                Your profile
              </p>
              <h1 className="mt-2 text-4xl font-black">{name || loggedUser.name}</h1>
              <p className="mt-1 text-slate-300">@{loggedUser.username}</p>
              {bio && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  {bio}
                </p>
              )}
              <Link
                to={"/users/" + loggedUser.username}
                className="mt-4 inline-block rounded-lg text-sm font-bold text-indigo-200 underline decoration-white/20 underline-offset-4 hover:text-white"
              >
                View public profile →
              </Link>
            </div>
          </div>
        </div>

        <form className="grid gap-6 p-6 sm:p-10" onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Personalise your profile
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Your username stays fixed. Your bio and featured story help
                visitors understand what you write about.
              </p>
            </div>

            <Link
              to="/settings"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              Security settings
            </Link>
          </div>

          <label>
            <span className="text-sm font-bold text-slate-800">Display name</span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
                setMessage("");
              }}
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label>
            <span className="flex items-center justify-between text-sm font-bold text-slate-800">
              Bio
              <span className="font-medium text-slate-400">{bio.length}/500</span>
            </span>
            <textarea
              value={bio}
              onChange={(event) => {
                setBio(event.target.value);
                setError("");
                setMessage("");
              }}
              rows={4}
              maxLength={500}
              placeholder="What do you write about?"
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 leading-7 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-slate-800">
              Featured story
            </span>
            <select
              value={pinnedArticleId}
              onChange={(event) => setPinnedArticleId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">No featured story</option>
              {ownArticles.map((article) => (
                <option key={article.article_id} value={article.article_id}>
                  {article.title}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs leading-5 text-slate-500">
              Only your own published stories can be pinned.
            </span>
          </label>

          <AvatarPicker
            value={avatarUrl}
            onChange={(nextAvatar) => {
              setAvatarUrl(nextAvatar);
              setError("");
              setMessage("");
            }}
            name={name}
            username={loggedUser.username}
            disabled={isSaving}
          />

          <div aria-live="polite">
            {message && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {message}
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-black text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving changes..." : "Save changes"}
            </button>
            <p className="text-xs leading-5 text-slate-500">
              Changes appear on your public profile straight away.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UserProfile;
