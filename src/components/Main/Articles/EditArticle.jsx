import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import { fetchArticle, updateArticleContent } from "../../../api/api";
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

    fetchArticle(article_id)
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
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
            Owner only
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            You cannot edit this article
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            Only @{article.author} can change this story.
          </p>
          <Link
            to={"/articles/" + article.article_id}
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
          >
            Back to article
          </Link>
        </div>
      </section>
    );
  }

  const handleUpdate = async (updates) => {
    setSaveError("");
    setIsSubmitting(true);

    try {
      await updateArticleContent(article.article_id, updates);
      navigate("/articles/" + article.article_id);
    } catch (err) {
      setSaveError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <ArticleEditorForm
      initialValues={initialValues}
      heading="Edit your story"
      description="Update the content without changing ownership, creation date or vote count."
      submitLabel="Save changes"
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      serverError={saveError}
    />
  );
}

export default EditArticle;
