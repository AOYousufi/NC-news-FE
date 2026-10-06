import { useEffect, useId, useState } from "react";
import { fetchTopics } from "../../../api/api";

const EMPTY_ARTICLE = {
  title: "",
  topic: "",
  body: "",
  article_img_url: "",
};

function ArticleEditorForm({
  initialValues = EMPTY_ARTICLE,
  onSubmit,
  submitLabel,
  heading,
  description,
  isSubmitting,
  serverError,
}) {
  const [form, setForm] = useState({ ...EMPTY_ARTICLE, ...initialValues });
  const [topics, setTopics] = useState([]);
  const [topicsError, setTopicsError] = useState("");
  const [validationError, setValidationError] = useState("");
  const formHelpId = useId();

  useEffect(() => {
    setForm({ ...EMPTY_ARTICLE, ...initialValues });
  }, [
    initialValues.title,
    initialValues.topic,
    initialValues.body,
    initialValues.article_img_url,
  ]);

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch((error) => setTopicsError(error.message));
  }, []);

  const updateField = (event) => {
    setValidationError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidationError("");

    const title = form.title.trim();
    const topic = form.topic.trim();
    const body = form.body.trim();

    if (!title || !topic || !body) {
      setValidationError("Title, topic and article body are required.");
      return;
    }

    if (title.length > 300) {
      setValidationError("Title must be 300 characters or fewer.");
      return;
    }

    onSubmit({
      title,
      topic,
      body,
      article_img_url: form.article_img_url.trim() || null,
    });
  };

  const visibleError = validationError || serverError || topicsError;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-9 text-white sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-200">
            Publisher
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {heading}
          </h1>
          <p id={formHelpId} className="mt-3 max-w-2xl leading-7 text-slate-300">
            {description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-describedby={formHelpId}
          className="grid gap-7 p-6 sm:p-10"
        >
          <label className="block">
            <span className="flex items-center justify-between gap-3 text-sm font-black text-slate-800">
              Article title
              <span className="font-medium text-slate-400">
                {form.title.length}/300
              </span>
            </span>
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              maxLength={300}
              placeholder="Give readers a reason to open the story"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-lg font-bold text-slate-950 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-800">Topic</span>
            <select
              name="topic"
              value={form.topic}
              onChange={updateField}
              disabled={!topics.length}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
            >
              <option value="">
                {topics.length ? "Choose a topic" : "Loading topics..."}
              </option>
              {topics.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.slug}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-800">
              Article body
            </span>
            <textarea
              name="body"
              value={form.body}
              onChange={updateField}
              rows={12}
              placeholder="Write the story here..."
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            <span className="mt-2 block text-xs leading-5 text-slate-500">
              Plain text is kept intentionally simple for now. Paragraph breaks
              are preserved when the article is displayed.
            </span>
          </label>

          <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-end">
            <label className="block">
              <span className="text-sm font-black text-slate-800">
                Cover image URL{" "}
                <span className="font-medium text-slate-400">(optional)</span>
              </span>
              <input
                name="article_img_url"
                type="url"
                value={form.article_img_url || ""}
                onChange={updateField}
                placeholder="https://example.com/story-image.jpg"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {form.article_img_url ? (
                <img
                  src={form.article_img_url}
                  alt="Article cover preview"
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center px-4 text-center text-sm font-semibold text-slate-400">
                  Cover preview
                </div>
              )}
            </div>
          </div>

          {visibleError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {visibleError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Your account is automatically recorded as the author. The
              frontend never sends a different username for ownership.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-6 py-3.5 font-black text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ArticleEditorForm;
