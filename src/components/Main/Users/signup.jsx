import { useContext, useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import AvatarPicker from "../../UI/AvatarPicker";

const SignUp = () => {
  const { loggedUser, register } = useContext(UserContext);
  const [form, setForm] = useState({
    username: "",
    name: "",
    avatar_url: "",
    password: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formHelpId = useId();
  const errorId = useId();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) navigate("/articles", { replace: true });
  }, [loggedUser, navigate]);

  const updateField = (event) => {
    setError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const updateAvatar = (avatarUrl) => {
    setError("");
    setForm((current) => ({ ...current, avatar_url: avatarUrl }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.name.trim() || !form.password) {
      setError("Username, name and password are required.");
      return;
    }

    if (!/^[A-Za-z0-9_-]{3,30}$/.test(form.username.trim())) {
      setError(
        "Username must be 3–30 characters using letters, numbers, _ or -."
      );
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        {
          username: form.username.trim(),
          name: form.name.trim(),
          avatar_url: form.avatar_url.trim() || undefined,
          password: form.password,
        },
        rememberMe
      );
      navigate("/articles");
    } catch (err) {
      setError(
        err.status === 409 ? "That username is already taken." : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto flex max-w-6xl items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute left-[-8rem] top-12 -z-10 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-1/3 -z-10 h-96 w-96 rounded-full bg-violet-100/80 blur-3xl" />

      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-indigo-100/50">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-950 px-6 py-8 text-white sm:px-9">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">
            Join NC News
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Create a profile that feels like yours
          </h1>
          <p
            id={formHelpId}
            className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base"
          >
            Browse without an account, or sign up to vote, comment, publish and
            manage your public profile.
          </p>
        </div>

        <form
          className="grid gap-6 p-6 sm:p-9"
          onSubmit={handleSubmit}
          aria-describedby={formHelpId + (error ? " " + errorId : "")}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-800">Username</span>
              <input
                name="username"
                value={form.username}
                onChange={updateField}
                autoComplete="username"
                placeholder="e.g. ozair_dev"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-800">
                Display name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                autoComplete="name"
                placeholder="How people will see you"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
          </div>

          <AvatarPicker
            value={form.avatar_url}
            onChange={updateAvatar}
            name={form.name}
            username={form.username}
            disabled={isSubmitting}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-800">Password</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-800">
                Confirm password
              </span>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={updateField}
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              <span className="block text-sm font-black text-slate-800">
                Keep me signed in on this device
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                If off, refreshes are still fine but the saved session ends
                when your browser session ends.
              </span>
            </span>
          </label>

          {error && (
            <p
              id={errorId}
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 px-5 py-3.5 font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating your account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-black text-indigo-700 underline decoration-indigo-200 underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
