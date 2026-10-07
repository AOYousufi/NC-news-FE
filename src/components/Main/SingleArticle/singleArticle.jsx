import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import {
  deleteArticle,
  fetchArticle,
  fetchArticleVote,
  fetchSavedArticles,
  saveArticle,
  unsaveArticle,
  updateVotes,
} from "../../../api/api";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";
import PostComment from "./addNewComment";
import ArticleComments from "./articlesComments";
import ReportButton from "../../UI/ReportButton";

function SingleArticle() {
  const { article_id } = useParams();
  const navigate = useNavigate();
  const { loggedUser } = useContext(UserContext);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState("");
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setError(null);
    setActionError("");
    setArticle(null);
    setUserVote(0);
    setIsSaved(false);
    setShowDeleteConfirm(false);

    fetchArticle(article_id)
      .then((data) => {
        setArticle(data);
        setVotes(data.votes);
      })
      .catch(setError);
  }, [article_id]);

  useEffect(() => {
    if (!article || !loggedUser) {
      setUserVote(0);
      setIsSaved(false);
      return;
    }

    let active = true;

    fetchSavedArticles()
      .then((articles) => {
        if (active) {
          setIsSaved(
            articles.some(
              (savedArticle) =>
                savedArticle.article_id === article.article_id
            )
          );
        }
      })
      .catch(() => {
        if (active) setIsSaved(false);
      });

    if (loggedUser.username === article.author) {
      setUserVote(0);
      return () => {
        active = false;
      };
    }

    setIsVoteLoading(true);

    fetchArticleVote(article.article_id)
      .then(({ vote }) => {
        if (active) setUserVote(vote);
      })
      .catch(() => {
        if (active) setUserVote(0);
      })
      .finally(() => {
        if (active) setIsVoteLoading(false);
      });

    return () => {
      active = false;
    };
  }, [article, loggedUser]);

  const ownsArticle = loggedUser?.username === article?.author;

  const handleVote = async (choice) => {
    if (!loggedUser || ownsArticle || isVoting || isVoteLoading) return;

    const previousVote = userVote;
    const previousVotes = votes;
    const nextVote = previousVote === choice ? 0 : choice;
    const delta = nextVote - previousVote;

    setUserVote(nextVote);
    setVotes((current) => current + delta);
    setIsVoting(true);
    setActionError("");

    try {
      const updated = await updateVotes(article.article_id, {
        inc_votes: choice,
      });
      setVotes(updated.votes);
      setUserVote(updated.user_vote);
    } catch (err) {
      setVotes(previousVotes);
      setUserVote(previousVote);
      setActionError(err.message);
    } finally {
      setIsVoting(false);
    }
  };

  const toggleSaved = async () => {
    if (!loggedUser || isSaveLoading) return;

    const previous = isSaved;
    setIsSaved(!previous);
    setIsSaveLoading(true);
    setActionError("");

    try {
      if (previous) {
        await unsaveArticle(article.article_id);
      } else {
        await saveArticle(article.article_id);
      }
    } catch (err) {
      setIsSaved(previous);
      setActionError(err.message);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionError("");
    setIsDeleting(true);

    try {
      await deleteArticle(article.article_id);
      navigate("/articles", { replace: true });
    } catch (err) {
      setActionError(err.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (error) return <Error error={error} />;
  if (!article) return <Loading />;

  const edited =
    article.updated_at &&
    new Date(article.updated_at).getTime() >
      new Date(article.created_at).getTime() + 1000;

  const date = new Date(article.created_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
        >
          ← Back to articles
        </Link>

        <div className="flex flex-wrap gap-2">
          {loggedUser ? (
            <button
              type="button"
              onClick={toggleSaved}
              disabled={isSaveLoading}
              aria-pressed={isSaved}
              className={
                "rounded-xl border px-4 py-2 text-sm font-black transition disabled:opacity-60 " +
                (isSaved
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-slate-300 bg-white text-slate-700 hover:border-indigo-300")
              }
            >
              {isSaveLoading
                ? "Saving..."
                : isSaved
                  ? "★ Saved"
                  : "☆ Save"}
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-600"
            >
              ☆ Save
            </Link>
          )}

          {loggedUser && !ownsArticle && (
            <ReportButton
              targetType="article"
              targetId={article.article_id}
            />
          )}

          {ownsArticle && (
            <>
              <Link
                to={"/articles/" + article.article_id + "/edit"}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                Edit article
              </Link>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && ownsArticle && (
        <div
          role="alertdialog"
          aria-labelledby="delete-article-title"
          aria-describedby="delete-article-description"
          className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-5"
        >
          <h2 id="delete-article-title" className="font-black text-rose-950">
            Delete this article permanently?
          </h2>
          <p
            id="delete-article-description"
            className="mt-2 text-sm leading-6 text-rose-800"
          >
            The story and all comments underneath it will be removed. This
            cannot be undone.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-rose-800 disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Yes, delete article"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {article.article_img_url && (
          <img
            src={article.article_img_url}
            alt=""
            className="max-h-[460px] w-full object-cover"
          />
        )}

        <div className="p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            <Link
              to={"/articles/topics/" + article.topic}
              className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 transition hover:bg-indigo-100"
            >
              {article.topic}
            </Link>
            <span>{date}</span>
            {edited && (
              <span
                title={"Last edited " + new Date(article.updated_at).toLocaleString()}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-500"
              >
                Edited
              </span>
            )}
            <span>
              By{" "}
              <Link
                to={"/users/" + article.author}
                className="font-bold text-slate-700 hover:text-indigo-700"
              >
                @{article.author}
              </Link>
            </span>
            {ownsArticle && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                Your article
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-7 whitespace-pre-line text-lg leading-8 text-slate-700">
            {article.body}
          </p>

          <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4 text-sm font-bold text-slate-600">
              <span>{votes} votes</span>
              <span>{article.comment_count} comments</span>
            </div>

            {!loggedUser ? (
              <Link
                to="/login"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                Sign in to vote
              </Link>
            ) : ownsArticle ? (
              <p className="text-sm font-bold text-slate-400">
                You cannot vote on your own article
              </p>
            ) : (
              <div className="flex flex-wrap gap-2" aria-label="Article vote">
                <button
                  type="button"
                  aria-pressed={userVote === 1}
                  onClick={() => handleVote(1)}
                  disabled={isVoting || isVoteLoading}
                  className={
                    "rounded-xl px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 " +
                    (userVote === 1
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100")
                  }
                >
                  {userVote === 1 ? "✓ Agreed" : "Agree"}
                </button>
                <button
                  type="button"
                  aria-pressed={userVote === -1}
                  onClick={() => handleVote(-1)}
                  disabled={isVoting || isVoteLoading}
                  className={
                    "rounded-xl px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 " +
                    (userVote === -1
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100")
                  }
                >
                  {userVote === -1 ? "✓ Disagreed" : "Disagree"}
                </button>
              </div>
            )}
          </div>

          {userVote !== 0 && !actionError && (
            <p className="mt-4 text-sm font-semibold text-slate-500">
              Your vote is saved. Choose the other option to switch instantly,
              or click your active vote again to remove it.
            </p>
          )}

          {actionError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {actionError}
            </p>
          )}
        </div>
      </article>

      <div className="mt-8">
        <PostComment
          article_id={article.article_id}
          comments={comments}
          setComments={setComments}
        />
      </div>

      <div className="mt-8">
        <ArticleComments
          article_id={article.article_id}
          comments={comments}
          setComments={setComments}
        />
      </div>
    </section>
  );
}

export default SingleArticle;
