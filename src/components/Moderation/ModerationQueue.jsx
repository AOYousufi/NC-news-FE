import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import {
  fetchModerationReports,
  reviewModerationReport,
} from "../../api/api";
import Loading from "../UI/Loading";

function ModerationQueue() {
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("open");
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser || loggedUser.role !== "moderator") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    fetchModerationReports(status)
      .then(setReports)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [loggedUser, status]);

  const review = async (reportId, nextStatus) => {
    setUpdatingId(reportId);
    setError("");

    try {
      const updated = await reviewModerationReport(reportId, nextStatus);
      setReports((current) =>
        status === "all"
          ? current.map((report) =>
              report.report_id === reportId ? updated : report
            )
          : current.filter((report) => report.report_id !== reportId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isAuthLoading || isLoading) return <Loading />;
  if (!loggedUser) return null;

  if (loggedUser.role !== "moderator") {
    return (
      <section className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
            Moderator area
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Moderator access required
          </h1>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-black text-white"
          >
            Back home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
            Trust & safety
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Moderation queue
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            Review community reports and record whether each one was resolved or
            dismissed.
          </p>
        </div>

        <label className="text-sm font-bold text-slate-700">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
            <option value="all">All</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          {error}
        </p>
      )}

      {reports.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No {status === "all" ? "" : status + " "}reports.
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {reports.map((report) => (
            <article
              key={report.report_id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-amber-700">
                      {report.reason}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-600">
                      {report.target_type}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      #{report.report_id}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-black text-slate-950">
                    {report.article_title || "Reported content"}
                  </h2>

                  {report.comment_body && (
                    <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                      “{report.comment_body}”
                    </p>
                  )}

                  {report.details && (
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {report.details}
                    </p>
                  )}

                  <p className="mt-3 text-xs font-semibold text-slate-400">
                    Reported by @{report.reporter_username} ·{" "}
                    {new Date(report.created_at).toLocaleString()}
                  </p>

                  {report.article_id && (
                    <Link
                      to={"/articles/" + report.article_id}
                      className="mt-3 inline-block text-sm font-black text-indigo-600 hover:text-indigo-700"
                    >
                      Open article →
                    </Link>
                  )}
                </div>

                {report.status === "open" ? (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => review(report.report_id, "resolved")}
                      disabled={updatingId === report.report_id}
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Resolve
                    </button>
                    <button
                      type="button"
                      onClick={() => review(report.report_id, "dismissed")}
                      disabled={updatingId === report.report_id}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-600">
                      {report.status}
                    </span>
                    {report.reviewer_username && (
                      <p className="mt-2 text-xs text-slate-400">
                        by @{report.reviewer_username}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ModerationQueue;
