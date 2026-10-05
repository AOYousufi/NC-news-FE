import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";

const SignUp = () => {
  const { loggedUser, register } = useContext(UserContext);
  const [form, setForm] = useState({
    username: "",
    name: "",
    avatar_url: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) {
      navigate("/articles", { replace: true });
    }
  }, [loggedUser, navigate]);

  const updateField = (event) => {
    setError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
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
      await register({
        username: form.username.trim(),
        name: form.name.trim(),
        avatar_url: form.avatar_url.trim() || undefined,
        password: form.password,
      });
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
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-100 blur-3xl" />

      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
          Join the community
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          A simple account is all you need to vote, comment and manage your
          public profile.
        </p>

        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Username</span>
            <input
              name="username"
              value={form.username}
              onChange={updateField}
              autoComplete="username"
              placeholder="e.g. ozair_dev"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              placeholder="Your display name"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">
              Avatar URL{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </span>
            <input
              name="avatar_url"
              type="url"
              value={form.avatar_url}
              onChange={updateField}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              placeholder="8+ characters"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Confirm password
            </span>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateField}
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
