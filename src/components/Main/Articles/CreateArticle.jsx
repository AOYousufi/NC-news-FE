import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import { createArticle } from "../../../api/api";
import Loading from "../../UI/Loading";
import ArticleEditorForm from "./ArticleEditorForm";

function CreateArticle() {
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  if (isAuthLoading || !loggedUser) return <Loading />;

  const handleCreate = async (article) => {
    setError("");
    setIsSubmitting(true);

    try {
      const created = await createArticle(article);
      navigate(
        created.status === "draft"
          ? "/dashboard"
          : "/articles/" + created.article_id
      );
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <ArticleEditorForm
      initialStatus="draft"
      heading="Write a new story"
      description="Start privately as a draft or publish when it is ready. Your signed-in account is always the author."
      onSubmit={handleCreate}
      isSubmitting={isSubmitting}
      serverError={error}
    />
  );
}

export default CreateArticle;
