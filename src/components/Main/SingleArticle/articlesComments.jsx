import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../Context/userContext";
import { deleteComment, fetchComments } from "../../../api/api";
import Loading from "../../UI/Loading";

function ArticleComments({ article_id, comments, setComments }) {
  const { loggedUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError("");

    fetchComments(article_id)
      .then(setComments)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [article_id, setComments]);

  const handleDelete = async (commentId) => {
    const previous = comments;
    setDeletingId(commentId);
    setError("");
    setComments((current) =>
      current.filter((comment) => comment.comment_id !== commentId)
    );

    try {
      await deleteComment(commentId);
    } catch (err) {
      setComments(previous);
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <Loading compact />;

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
            Discussion
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Comments
          </h2>
        </div>
        <span className="text-sm font-semibold text-slate-500">
          {comments.length} total
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {comments.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No comments yet. Be the first to start the discussion.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {comments.map((comment) => {
            const ownsComment = loggedUser?.username === comment.author;
            const date = new Date(comment.created_at).toLocaleDateString();

            return (
              <article
                key={comment.comment_id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">@{comment.author}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {date} · {comment.votes} votes
                    </p>
                  </div>

                  {ownsComment && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.comment_id)}
                      disabled={deletingId === comment.comment_id}
                      className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deletingId === comment.comment_id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>

                <p className="mt-4 whitespace-pre-line break-words leading-7 text-slate-700">
                  {comment.body}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ArticleComments;
