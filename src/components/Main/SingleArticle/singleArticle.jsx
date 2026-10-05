import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import { fetchArticle, updateVotes } from "../../../api/api";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";
import PostComment from "./addNewComment";
import ArticleComments from "./articlesComments";

function SingleArticle() {
  const { article_id } = useParams();
  const { loggedUser } = useContext(UserContext);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setError(null);
    setArticle(null);
    setHasVoted(false);

    fetchArticle(article_id)
      .then((data) => {
        setArticle(data);
        setVotes(data.votes);
      })
      .catch(setError);
  }, [article_id]);

  const handleVote = async (change) => {
    if (!loggedUser || hasVoted || isVoting) return;

    const previousVotes = votes;
    setVotes((current) => current + change);
    setHasVoted(true);
    setIsVoting(true);
    setError(null);

    try {
      const updated = await updateVotes(article.article_id, {
        inc_votes: change,
      });
      setVotes(updated.votes);
    } catch (err) {
      setVotes(previousVotes);
      setHasVoted(false);
      setError(err);
    } finally {
      setIsVoting(false);
    }
  };

  if (error) return <Error error={error} />;
  if (!article) return <Loading />;

  const date = new Date(article.created_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
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
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
              {article.topic}
            </span>
            <span>{date}</span>
            <span>By {article.author}</span>
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

            {loggedUser ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleVote(1)}
                  disabled={hasVoted || isVoting}
                  className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Agree
                </button>
                <button
                  type="button"
                  onClick={() => handleVote(-1)}
                  disabled={hasVoted || isVoting}
                  className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Disagree
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                Sign in to vote
              </Link>
            )}
          </div>
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
