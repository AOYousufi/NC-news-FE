import { useContext, useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";

const Login = () => {
  const { loggedUser, login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorId = useId();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) {
      navigate("/articles", { replace: true });
    }
  }, [loggedUser, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ username: username.trim(), password });
      navigate("/articles");
    } catch (err) {
      setError(
        err.status === 401
          ? "That username or password is incorrect."
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute left-[-7rem] top-12 -z-10 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] bottom-10 -z-10 h-80 w-80 rounded-full bg-indigo-100/80 blur-3xl" />

      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-indigo-100/50">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-8 text-white sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-200">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Log in to NC News
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Browsing is always public. Sign in when you want to vote, comment or
            manage your profile.
          </p>
        </div>

        <form
          className="space-y-5 p-6 sm:p-8"
          onSubmit={handleSubmit}
          aria-describedby={error ? errorId : undefined}
        >
          <label className="block">
            <span className="text-sm font-bold text-slate-800">Username</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-800">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
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
            className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-black text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging you in..." : "Log in"}
          </button>

          <p className="pt-1 text-center text-sm text-slate-600">
            New here?{" "}
            <Link
              to="/signup"
              className="font-black text-indigo-700 underline decoration-indigo-200 underline-offset-4 transition hover:text-indigo-900"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
