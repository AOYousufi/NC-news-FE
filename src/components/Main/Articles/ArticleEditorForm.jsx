import { useEffect, useId, useState } from "react";
import { createTopic, fetchTopics } from "../../../api/api";

const EMPTY_ARTICLE = {
  title: "",
  topic: "",
  body: "",
  article_img_url: "",
};

function ArticleEditorForm({
  initialValues = EMPTY_ARTICLE,
  initialStatus = "published",
  onSubmit,
  heading,
  description,
  isSubmitting,
  serverError,
}) {
  const [form, setForm] = useState({ ...EMPTY_ARTICLE, ...initialValues });
  const [topics, setTopics] = useState([]);
  const [topicsError, setTopicsError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showTopicCreator, setShowTopicCreator] = useState(false);
  const [topicDraft, setTopicDraft] = useState({ slug: "", description: "" });
  const [topicCreateError, setTopicCreateError] = useState("");
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const formHelpId = useId();

  useEffect(() => {
    setForm({ ...EMPTY_ARTICLE, ...initialValues });
  }, [initialValues]);

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

  const handleCreateTopic = async () => {
    setTopicCreateError("");

    const slug = topicDraft.slug.trim().toLowerCase();
    const topicDescription = topicDraft.description.trim();

    if (!/^[a-z0-9-]{2,40}$/.test(slug)) {
      setTopicCreateError(
        "Topic slug must be 2–40 characters using lowercase letters, numbers or hyphens."
      );
      return;
    }

    if (topicDescription.length < 3) {
      setTopicCreateError("Add a short description for the topic.");
      return;
    }

    setIsCreatingTopic(true);

    try {
      const topic = await createTopic({
        slug,
        description: topicDescription,
      });
      setTopics((current) =>
        [...current, topic].sort((a, b) => a.slug.localeCompare(b.slug))
      );
      setForm((current) => ({ ...current, topic: topic.slug }));
      setTopicDraft({ slug: "", description: "" });
      setShowTopicCreator(false);
    } catch (error) {
      setTopicCreateError(error.message);
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const buildArticle = () => {
    setValidationError("");

    const title = form.title.trim();
    const topic = form.topic.trim();
    const body = form.body.trim();

    if (!title || !topic || !body) {
      setValidationError("Title, topic and article body are required.");
      return null;
    }

    if (title.length > 300) {
      setValidationError("Title must be 300 characters or fewer.");
      return null;
    }

    return {
      title,
      topic,
      body,
      article_img_url: form.article_img_url.trim() || null,
    };
  };

  const submitAs = (status) => {
    const article = buildArticle();
    if (!article) return;
    onSubmit({ ...article, status });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitAs("published");
  };

  const visibleError = validationError || serverError || topicsError;
  const draftLabel =
    initialStatus === "draft" ? "Save draft" : "Move to drafts";
  const publishLabel =
    initialStatus === "draft" ? "Publish article" : "Save changes";

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-9 text-white sm:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-200">
              Publisher
            </p>
            <span
              className={
                "rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide " +
                (initialStatus === "draft"
                  ? "bg-amber-400/15 text-amber-200"
                  : "bg-emerald-400/15 text-emerald-200")
              }
            >
              {initialStatus}
            </span>
          </div>
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <label className="min-w-0 flex-1">
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

              <button
                type="button"
                onClick={() => {
                  setShowTopicCreator((current) => !current);
                  setTopicCreateError("");
                }}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-700 transition hover:bg-indigo-100"
              >
                {showTopicCreator ? "Cancel" : "+ New topic"}
              </button>
            </div>

            {showTopicCreator && (
              <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">
                    Topic slug
                  </span>
                  <input
                    value={topicDraft.slug}
                    onChange={(event) =>
                      setTopicDraft((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    placeholder="e.g. technology"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold text-slate-700">
                    Description
                  </span>
                  <input
                    value={topicDraft.description}
                    onChange={(event) =>
                      setTopicDraft((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="What belongs in this topic?"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                {topicCreateError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:col-span-2"
                  >
                    {topicCreateError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCreateTopic}
                  disabled={isCreatingTopic}
                  className="w-fit rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60 sm:col-span-2"
                >
                  {isCreatingTopic ? "Creating topic..." : "Create and select"}
                </button>
              </div>
            )}
          </div>

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
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Drafts are private. Publishing makes the story visible in public
              feeds and on your profile.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => submitAs("draft")}
                disabled={isSubmitting}
                className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 font-black text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : draftLabel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : publishLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ArticleEditorForm;
