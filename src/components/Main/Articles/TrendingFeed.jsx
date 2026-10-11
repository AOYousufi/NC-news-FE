import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchTrendingArticles,
  fetchTrendingTopics,
} from "../../../api/api";
import Loading from "../../UI/Loading";
import ArticleCard from "./ArticleCard";

function TrendingFeed() {
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTrendingArticles({ limit: 12 }), fetchTrendingTopics()])
      .then(([articleData, topicData]) => {
        setArticles(articleData);
        setTopics(topicData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loading />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-9 text-white shadow-xl sm:px-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">
          Hot now
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Trending on NC News
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-300">
          Ranked from votes, discussion and freshness—not a third-party
          recommendation service.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      {topics.length > 0 && (
        <div className="mt-7">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
            Trending topics
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                to={"/articles/topics/" + topic.slug}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {topic.slug}
                <span className="ml-2 text-xs font-semibold text-slate-400">
                  {topic.article_count} stories · {topic.comment_count} comments
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5">
        {articles.length ? (
          articles.map((article) => (
            <ArticleCard
              key={article.article_id}
              {...article}
              img_url={article.article_img_url}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No trending stories yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default TrendingFeed;
