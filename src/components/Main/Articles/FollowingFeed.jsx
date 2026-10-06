import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import { fetchFollowingFeed } from "../../../api/api";
import Loading from "../../UI/Loading";
import ArticleCard from "./ArticleCard";

function FollowingFeed() {
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser) return;
    fetchFollowingFeed()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [loggedUser]);

  if (isAuthLoading || isLoading) return <Loading />;
  if (!loggedUser) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
          Personalised
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Following feed
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Fresh stories from the writers you chose to follow.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      {articles.length ? (
        <div className="mt-7 grid gap-5">
          {articles.map((article) => (
            <ArticleCard
              key={article.article_id}
              {...article}
              img_url={article.article_img_url}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-black text-slate-900">Your feed is quiet</h2>
          <p className="mt-2 text-slate-500">
            Follow a few writers and their published stories will show up here.
          </p>
          <Link
            to="/users"
            className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-black text-white"
          >
            Explore community
          </Link>
        </div>
      )}
    </section>
  );
}

export default FollowingFeed;
