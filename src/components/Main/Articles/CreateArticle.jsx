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
      navigate("/articles/" + created.article_id);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <ArticleEditorForm
      heading="Publish a new story"
      description="Create something worth discussing. Your signed-in account becomes the author automatically, and only you will be able to edit or delete it."
      submitLabel="Publish article"
      onSubmit={handleCreate}
      isSubmitting={isSubmitting}
      serverError={error}
    />
  );
}

export default CreateArticle;
