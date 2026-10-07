import { useState } from "react";
import { createReport } from "../../api/api";

const REASONS = [
  ["spam", "Spam"],
  ["harassment", "Harassment"],
  ["misinformation", "Misinformation"],
  ["off-topic", "Off topic"],
  ["other", "Other"],
];

function ReportButton({ targetType, targetId, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitReport = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await createReport({
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details.trim(),
      });
      setMessage("Report submitted for review.");
      setDetails("");
      setIsOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={compact ? "relative" : "w-full sm:w-auto"}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          setError("");
          setMessage("");
        }}
        className={
          compact
            ? "rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
            : "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
        }
      >
        Report
      </button>

      {message && (
        <span className="ml-2 text-xs font-semibold text-emerald-700">
          {message}
        </span>
      )}

      {isOpen && (
        <form
          onSubmit={submitReport}
          className={
            compact
              ? "mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
              : "mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:min-w-96"
          }
        >
          <p className="text-sm font-black text-slate-900">Report this {targetType}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Reports are reviewed by moderators. Choose the closest reason and add
            context only when useful.
          </p>

          <label className="mt-4 block">
            <span className="text-xs font-black uppercase tracking-wide text-slate-600">
              Reason
            </span>
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              {REASONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-3 block">
            <span className="text-xs font-black uppercase tracking-wide text-slate-600">
              Details <span className="font-medium text-slate-400">(optional)</span>
            </span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="What should the moderator know?"
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          {error && (
            <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">
              {error}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-black text-white disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ReportButton;
