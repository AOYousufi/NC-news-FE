import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArticles, fetchUser } from "../../../api/api";
import ArticleCard from "../Articles/ArticleCard";
import Avatar from "../../UI/Avatar";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";

function PublicUserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetchUser(username),
      fetchArticles({
        author: username,
        sort_by: "created_at",
        order: "desc",
      }),
    ])
      .then(([userData, articleData]) => {
        setUser(userData);
        setArticles(articleData);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [username]);

  if (error) return <Error error={error} />;
  if (isLoading || !user) return <Loading />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar user={user} size="lg" className="border-white/20" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-300">
                Community profile
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">
                {user.name}
              </h1>
              <p className="mt-1 text-slate-300">@{user.username}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-10">
          <p className="text-sm text-slate-500">
            {articles.length} {articles.length === 1 ? "article" : "articles"} published
          </p>
          <Link
            to="/users"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            Back to community
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
            Published stories
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Articles by {user.name}
          </h2>
        </div>

        {articles.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            This user has not published any articles yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-5">
            {articles.map((article) => (
              <ArticleCard
                key={article.article_id}
                title={article.title}
                topic={article.topic}
                img_url={article.article_img_url}
                article_id={article.article_id}
                votes={article.votes}
                created_at={article.created_at}
                author={article.author}
                comment_count={article.comment_count}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PublicUserProfile;
