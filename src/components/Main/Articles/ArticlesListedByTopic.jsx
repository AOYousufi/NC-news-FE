import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchArticles } from "../../../api/api";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";
import ArticleCard from "./ArticleCard";
import Topics from "./Topics";

function ListArticlesByTopic() {
  const { topic } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortCriteria = searchParams.get("sort_by") || "created_at";
  const sortOrder = searchParams.get("order") || "desc";

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchArticles({
      sort_by: sortCriteria,
      order: sortOrder,
      topic,
    })
      .then(setArticles)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [sortCriteria, sortOrder, topic]);

  const updateSort = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next);
  };

  if (error) return <Error error={error} />;

  const title = topic.charAt(0).toUpperCase() + topic.slice(1);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
          Topic
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          {title}
        </h1>
      </div>

      <div className="mt-6 space-y-4">
        <Topics setError={setError} />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
          <label className="text-sm font-semibold text-slate-700">
            Sort by
            <select
              value={sortCriteria}
              onChange={(event) => updateSort("sort_by", event.target.value)}
              className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              <option value="created_at">Date</option>
              <option value="votes">Votes</option>
              <option value="comment_count">Comments</option>
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Order
            <select
              value={sortOrder}
              onChange={(event) => updateSort("order", event.target.value)}
              className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-8 grid gap-5">
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
    </section>
  );
}

export default ListArticlesByTopic;
