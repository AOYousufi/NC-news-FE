import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import { addComment } from "../../../api/api";

function PostComment({ article_id, comments, setComments }) {
  const { loggedUser } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loggedUser) {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-indigo-900">
        Want to join the discussion?{" "}
        <Link to="/login" className="font-black underline underline-offset-2">
          Sign in
        </Link>{" "}
        to post a comment.
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newComment = await addComment(article_id, {
        body: comment.trim(),
      });
      setComments([newComment, ...comments]);
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-slate-950">Add a comment</h2>
          <p className="text-sm text-slate-500">Posting as @{loggedUser.username}</p>
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Share your thoughts..."
        rows="4"
        disabled={isSubmitting}
        className="mt-4 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "Posting..." : "Post comment"}
        </button>
      </div>
    </form>
  );
}

export default PostComment;
