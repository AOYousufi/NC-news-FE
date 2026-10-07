import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import {
  addComment,
  deleteComment,
  fetchComments,
  fetchCommentVotes,
  updateCommentVote,
} from "../../../api/api";
import Loading from "../../UI/Loading";

function buildCommentTree(comments) {
  const nodes = new Map(
    comments.map((comment) => [
      comment.comment_id,
      { ...comment, replies: [] },
    ])
  );

  const roots = [];

  nodes.forEach((comment) => {
    if (
      comment.parent_comment_id &&
      nodes.has(comment.parent_comment_id)
    ) {
      nodes.get(comment.parent_comment_id).replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  const newestFirst = (a, b) =>
    new Date(b.created_at) - new Date(a.created_at);
  const oldestFirst = (a, b) =>
    new Date(a.created_at) - new Date(b.created_at);

  roots.sort(newestFirst);
  nodes.forEach((comment) => comment.replies.sort(oldestFirst));

  return roots;
}

function CommentNode({
  comment,
  articleId,
  depth,
  loggedUser,
  refresh,
  deletingId,
  setDeletingId,
  setError,
  voteStates,
  onVoteChanged,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const ownsComment = loggedUser?.username === comment.author;
  const voteState = voteStates?.[comment.comment_id];
  const currentVote = voteState?.vote || 0;
  const canVote = voteState?.can_vote !== false && !ownsComment;
  const date = new Date(comment.created_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const submitReply = async (event) => {
    event.preventDefault();
    setError("");

    if (!reply.trim()) return;

    setIsSubmitting(true);

    try {
      await addComment(articleId, {
        body: reply.trim(),
        parent_comment_id: comment.comment_id,
      });
      setReply("");
      setIsReplying(false);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const vote = async (choice) => {
    if (!loggedUser || !canVote || isVoting) return;

    const previousVote = currentVote;
    const previousVotes = comment.votes;
    const nextVote = previousVote === choice ? 0 : choice;
    const delta = nextVote - previousVote;

    setIsVoting(true);
    setError("");
    onVoteChanged(comment.comment_id, nextVote, previousVotes + delta);

    try {
      const updated = await updateCommentVote(comment.comment_id, {
        inc_votes: choice,
      });
      onVoteChanged(comment.comment_id, updated.user_vote, updated.votes);
    } catch (err) {
      onVoteChanged(comment.comment_id, previousVote, previousVotes);
      setError(err.message);
    } finally {
      setIsVoting(false);
    }
  };

  const removeComment = async () => {
    setDeletingId(comment.comment_id);
    setError("");

    try {
      await deleteComment(comment.comment_id);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={
        depth > 0
          ? "ml-3 border-l-2 border-indigo-100 pl-3 sm:ml-7 sm:pl-5"
          : ""
      }
    >
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              to={"/users/" + comment.author}
              className="font-black text-slate-900 transition hover:text-indigo-700"
            >
              @{comment.author}
            </Link>
            <p className="mt-1 text-xs font-medium text-slate-400">
              {date}
              {comment.votes !== undefined ? " · " + comment.votes + " votes" : ""}
            </p>
          </div>

          <div className="flex gap-1">
            {loggedUser && (
              <button
                type="button"
                onClick={() => setIsReplying((current) => !current)}
                className="rounded-lg px-3 py-2 text-xs font-black text-indigo-600 transition hover:bg-indigo-50"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}

            {ownsComment && (
              <button
                type="button"
                onClick={removeComment}
                disabled={deletingId === comment.comment_id}
                className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
              >
                {deletingId === comment.comment_id ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 whitespace-pre-line break-words leading-7 text-slate-700">
          {comment.body}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          {loggedUser ? (
            canVote ? (
              <>
                <button
                  type="button"
                  aria-pressed={currentVote === 1}
                  onClick={() => vote(1)}
                  disabled={isVoting}
                  className={
                    "rounded-lg px-3 py-1.5 text-xs font-black transition disabled:opacity-50 " +
                    (currentVote === 1
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100")
                  }
                >
                  {currentVote === 1 ? "✓ Agree" : "Agree"}
                </button>
                <button
                  type="button"
                  aria-pressed={currentVote === -1}
                  onClick={() => vote(-1)}
                  disabled={isVoting}
                  className={
                    "rounded-lg px-3 py-1.5 text-xs font-black transition disabled:opacity-50 " +
                    (currentVote === -1
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100")
                  }
                >
                  {currentVote === -1 ? "✓ Disagree" : "Disagree"}
                </button>
              </>
            ) : (
              <span className="text-xs font-bold text-slate-400">
                Your comment
              </span>
            )
          ) : (
            <Link to="/login" className="text-xs font-black text-indigo-600">
              Sign in to vote
            </Link>
          )}
        </div>

        {isReplying && (
          <form
            onSubmit={submitReply}
            className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3"
          >
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-indigo-700">
                Reply to @{comment.author}
              </span>
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                rows={3}
                placeholder="Write a reply..."
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !reply.trim()}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50"
              >
                {isSubmitting ? "Replying..." : "Post reply"}
              </button>
            </div>
          </form>
        )}
      </article>

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((replyComment) => (
            <CommentNode
              key={replyComment.comment_id}
              comment={replyComment}
              articleId={articleId}
              depth={Math.min(depth + 1, 5)}
              loggedUser={loggedUser}
              refresh={refresh}
              deletingId={deletingId}
              setDeletingId={setDeletingId}
              setError={setError}
              voteStates={voteStates}
              onVoteChanged={onVoteChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleComments({ article_id, comments, setComments }) {
  const { loggedUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [voteStates, setVoteStates] = useState({});

  const onVoteChanged = useCallback(
    (commentId, vote, nextVotes) => {
      setVoteStates((current) => ({
        ...current,
        [commentId]: {
          ...(current[commentId] || {}),
          vote,
        },
      }));
      setComments((current) =>
        current.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, votes: nextVotes }
            : comment
        )
      );
    },
    [setComments]
  );

  const refresh = useCallback(async () => {
    const nextComments = await fetchComments(article_id);
    setComments(nextComments);
    return nextComments;
  }, [article_id, setComments]);

  useEffect(() => {
    if (!loggedUser) {
      setVoteStates({});
      return;
    }

    fetchCommentVotes(article_id)
      .then((votes) => {
        setVoteStates(
          Object.fromEntries(votes.map((item) => [item.comment_id, item]))
        );
      })
      .catch(() => setVoteStates({}));
  }, [article_id, loggedUser]);

  useEffect(() => {
    setIsLoading(true);
    setError("");

    refresh()
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [refresh]);

  const tree = useMemo(() => buildCommentTree(comments), [comments]);

  if (isLoading) return <Loading compact />;

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
            Discussion
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Conversation
          </h2>
        </div>
        <span className="text-sm font-semibold text-slate-500">
          {comments.length} total
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {tree.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No comments yet. Be the first to start the discussion.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {tree.map((comment) => (
            <CommentNode
              key={comment.comment_id}
              comment={comment}
              articleId={article_id}
              depth={0}
              loggedUser={loggedUser}
              refresh={refresh}
              deletingId={deletingId}
              setDeletingId={setDeletingId}
              setError={setError}
              voteStates={voteStates}
              onVoteChanged={onVoteChanged}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ArticleComments;
