import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchArticles } from "../../../api/api";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";
import ArticleCard from "./ArticleCard";
import Topics from "./Topics";

const PAGE_SIZE = 8;

function ListArticlesByTopic() {
  const { topic } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortCriteria = searchParams.get("sort_by") || "created_at";
  const sortOrder = searchParams.get("order") || "desc";
  const page = Math.max(Number(searchParams.get("p")) || 1, 1);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchArticles({
      sort_by: sortCriteria,
      order: sortOrder,
      topic,
      limit: PAGE_SIZE,
      p: page,
    })
      .then(setArticles)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [page, sortCriteria, sortOrder, topic]);

  const updateSearch = (changes) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      next.set(key, String(value));
    });

    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeSort = (key, value) => {
    updateSearch({ [key]: value, p: 1 });
  };

  if (error) return <Error error={error} />;

  const title = topic.charAt(0).toUpperCase() + topic.slice(1);
  const hasPrevious = page > 1;
  const hasNext = articles.length === PAGE_SIZE;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
          Topic
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-2 text-slate-500">
          Stories filed under {topic}.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <Topics setError={setError} />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="text-sm font-semibold text-slate-700">
              Sort by
              <select
                value={sortCriteria}
                onChange={(event) => changeSort("sort_by", event.target.value)}
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
                onChange={(event) => changeSort("order", event.target.value)}
                className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </label>
          </div>

          <p className="text-sm font-semibold text-slate-400">Page {page}</p>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : articles.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No articles found on this page.
        </div>
      ) : (
        <>
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

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
            <button
              type="button"
              disabled={!hasPrevious}
              onClick={() => updateSearch({ p: page - 1 })}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-sm font-semibold text-slate-500">
              Page {page}
            </span>

            <button
              type="button"
              disabled={!hasNext}
              onClick={() => updateSearch({ p: page + 1 })}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ListArticlesByTopic;
