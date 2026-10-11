import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import {
  fetchModerationAnalytics,
  fetchModerationAudit,
  fetchModerationReports,
  reviewModerationReport,
} from "../../api/api";
import Loading from "../UI/Loading";

function ModerationQueue() {
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [section, setSection] = useState("reports");
  const [status, setStatus] = useState("open");
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [audit, setAudit] = useState([]);
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

    const load =
      section === "reports"
        ? fetchModerationReports(status).then(setReports)
        : section === "analytics"
          ? fetchModerationAnalytics().then(setAnalytics)
          : fetchModerationAudit().then(setAudit);

    load
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [loggedUser, section, status]);

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

  if (isAuthLoading) return <Loading />;
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

  const tabs = [
    ["reports", "Reports"],
    ["analytics", "Analytics"],
    ["audit", "Audit log"],
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
          Trust & safety
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Moderation
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Review reports, understand platform health and keep an auditable
          record of moderation decisions.
        </p>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Moderation sections">
          {tabs.map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={section === value}
              onClick={() => setSection(value)}
              className={
                "rounded-xl px-4 py-2.5 text-sm font-black transition " +
                (section === value
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800"
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <Loading />
      ) : section === "reports" ? (
        <ReportsPanel
          reports={reports}
          status={status}
          setStatus={setStatus}
          updatingId={updatingId}
          review={review}
        />
      ) : section === "analytics" ? (
        <AnalyticsPanel analytics={analytics} />
      ) : (
        <AuditPanel audit={audit} />
      )}
    </section>
  );
}

function ReportsPanel({ reports, status, setStatus, updatingId, review }) {
  return (
    <div className="mt-7">
      <div className="flex justify-end">
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

      {reports.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No {status === "all" ? "" : status + " "}reports.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
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
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-600">
                    {report.status}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;

  const countLabels = {
    users: "Users",
    published_articles: "Published",
    drafts: "Drafts",
    comments: "Comments",
    open_reports: "Open reports",
    saved_articles: "Saved",
    user_follows: "User follows",
    topic_follows: "Topic follows",
    collections: "Collections",
  };

  return (
    <div className="mt-7 space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(analytics.counts || {}).map(([key, value]) => (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              {countLabels[key] || key}
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Active topics</h2>
          <div className="mt-4 space-y-3">
            {(analytics.top_topics || []).map((topic) => (
              <div key={topic.slug} className="flex items-center justify-between gap-3">
                <span className="font-black text-slate-800">#{topic.slug}</span>
                <span className="text-sm font-semibold text-slate-500">
                  {topic.articles} articles · {topic.comments} comments
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Active contributors</h2>
          <div className="mt-4 space-y-3">
            {(analytics.active_users || []).map((user) => (
              <Link
                key={user.username}
                to={"/users/" + user.username}
                className="flex items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-slate-50"
              >
                <span>
                  <span className="block font-black text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-400">@{user.username}</span>
                </span>
                <span className="text-sm font-black text-indigo-600">
                  {user.contribution_score}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AuditPanel({ audit }) {
  return (
    <div className="mt-7">
      {audit.length ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {audit.map((item) => (
              <div key={item.audit_id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">
                      {item.action.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      @{item.moderator_username} · {item.target_type}
                      {item.target_id ? " #" + item.target_id : ""}
                    </p>
                  </div>
                  <time className="text-xs font-semibold text-slate-400">
                    {new Date(item.created_at).toLocaleString()}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No moderation actions recorded yet.
        </div>
      )}
    </div>
  );
}

export default ModerationQueue;
