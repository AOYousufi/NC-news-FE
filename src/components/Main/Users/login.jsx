import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";

const Login = () => {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
    <section className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Log in to NC News
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          You can browse without an account. Sign in when you want to vote or
          comment.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Username</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
