function Loading({ compact = false }) {
  return (
    <div
      className={
        "flex items-center justify-center " +
        (compact ? "py-12" : "min-h-[45vh]")
      }
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <span className="text-sm font-semibold">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
