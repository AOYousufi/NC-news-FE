import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import {
  fetchArticleRevisions,
  fetchManagedArticle,
  updateArticleContent,
} from "../../../api/api";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";
import ArticleEditorForm from "./ArticleEditorForm";

function EditArticle() {
  const { article_id } = useParams();
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [revisions, setRevisions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser) return;

    Promise.all([
      fetchManagedArticle(article_id),
      fetchArticleRevisions(article_id),
    ])
      .then(([articleData, revisionData]) => {
        setArticle(articleData);
        setRevisions(revisionData);
      })
      .catch(setLoadError);
  }, [article_id, loggedUser]);

  const initialValues = useMemo(
    () =>
      article
        ? {
            title: article.title,
            topic: article.topic,
            body: article.body,
            article_img_url: article.article_img_url || "",
          }
        : undefined,
    [article]
  );

  if (isAuthLoading || (loggedUser && !article && !loadError)) {
    return <Loading />;
  }

  if (loadError) return <Error error={loadError} />;
  if (!loggedUser || !article) return null;

  if (article.author !== loggedUser.username) {
    return (
      <section className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            You cannot edit this article
          </h1>
          <Link
            to="/articles"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
          >
            Back to articles
          </Link>
        </div>
      </section>
    );
  }

  const handleUpdate = async (updates) => {
    setSaveError("");
    setIsSubmitting(true);

    try {
      const updated = await updateArticleContent(article.article_id, updates);
      navigate(
        updated.status === "draft"
          ? "/dashboard"
          : "/articles/" + updated.article_id
      );
    } catch (err) {
      setSaveError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ArticleEditorForm
      initialValues={initialValues}
      initialStatus={article.status || "published"}
      heading={article.status === "draft" ? "Continue your draft" : "Edit your story"}
      description="Update the story privately or publish it when you are happy with the result."
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      serverError={saveError}
    />

      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
                History
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Previous versions
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-400">
              {revisions.length} {revisions.length === 1 ? "revision" : "revisions"}
            </span>
          </div>

          {revisions.length ? (
            <div className="mt-5 space-y-3">
              {revisions.map((revision, index) => (
                <details
                  key={revision.revision_id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <summary className="cursor-pointer font-black text-slate-900">
                    Version {revisions.length - index} ·{" "}
                    {new Date(revision.created_at).toLocaleString()}
                  </summary>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600">
                    <p><strong>Title:</strong> {revision.title}</p>
                    <p><strong>Topic:</strong> {revision.topic}</p>
                    <p><strong>Status:</strong> {revision.status}</p>
                    <p className="whitespace-pre-line leading-6">
                      <strong>Body:</strong> {revision.body}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No previous versions yet. The first edit will create one.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default EditArticle;
