import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import { changePassword, deleteAccount } from "../../api/api";
import Loading from "../UI/Loading";

function AccountSettings() {
  const { loggedUser, isAuthLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  if (isAuthLoading || !loggedUser) return <Loading />;

  const updateField = (event) => {
    setError("");
    setMessage("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      await changePassword(form.currentPassword, form.newPassword);
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage("Password changed successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setDeleteError("");

    if (deleteConfirmation !== loggedUser.username) {
      setDeleteError("Type your username exactly to confirm account deletion.");
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount(deletePassword, deleteConfirmation);
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Link
          to="/userProfile"
          className="text-sm font-black text-indigo-600 hover:text-indigo-700"
        >
          ← Back to profile
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-9 text-white sm:px-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-200">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-black">Security settings</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Change your password using your current password for confirmation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 p-6 sm:p-9">
          <label>
            <span className="text-sm font-black text-slate-800">
              Current password
            </span>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={updateField}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label>
            <span className="text-sm font-black text-slate-800">
              New password
            </span>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={updateField}
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label>
            <span className="text-sm font-black text-slate-800">
              Confirm new password
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={updateField}
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          {message && (
            <p
              aria-live="polite"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
            >
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

          <button
            type="submit"
            disabled={isSaving}
            className="w-fit rounded-xl bg-indigo-600 px-5 py-3 font-black text-white disabled:opacity-60"
          >
            {isSaving ? "Changing password..." : "Change password"}
          </button>
        </form>
      </div>

      <div className="mt-8 overflow-hidden rounded-[2rem] border border-rose-200 bg-white shadow-sm">
        <div className="border-b border-rose-100 bg-rose-50 px-6 py-6 sm:px-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">
            Danger zone
          </p>
          <h2 className="mt-2 text-2xl font-black text-rose-950">
            Delete account
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-rose-800">
            This permanently removes your account and your owned content. This
            action cannot be undone.
          </p>
        </div>

        <form onSubmit={handleDeleteAccount} className="grid gap-5 p-6 sm:p-9">
          <label>
            <span className="text-sm font-black text-slate-800">
              Current password
            </span>
            <input
              type="password"
              value={deletePassword}
              onChange={(event) => {
                setDeletePassword(event.target.value);
                setDeleteError("");
              }}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
            />
          </label>

          <label>
            <span className="text-sm font-black text-slate-800">
              Type <span className="text-rose-700">{loggedUser.username}</span>{" "}
              to confirm
            </span>
            <input
              value={deleteConfirmation}
              onChange={(event) => {
                setDeleteConfirmation(event.target.value);
                setDeleteError("");
              }}
              autoComplete="off"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
            />
          </label>

          {deleteError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {deleteError}
            </p>
          )}

          <button
            type="submit"
            disabled={
              isDeleting ||
              !deletePassword ||
              deleteConfirmation !== loggedUser.username
            }
            className="w-fit rounded-xl bg-rose-700 px-5 py-3 font-black text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting account..." : "Permanently delete account"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AccountSettings;
