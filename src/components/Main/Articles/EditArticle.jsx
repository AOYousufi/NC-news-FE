import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser) return;

    fetchManagedArticle(article_id)
      .then(setArticle)
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
    <ArticleEditorForm
      initialValues={initialValues}
      initialStatus={article.status || "published"}
      heading={article.status === "draft" ? "Continue your draft" : "Edit your story"}
      description="Update the story privately or publish it when you are happy with the result."
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      serverError={saveError}
    />
  );
}

export default EditArticle;
