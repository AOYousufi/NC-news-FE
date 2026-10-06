import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import {
  fetchActivity,
  fetchDrafts,
  fetchFollowing,
  fetchSavedArticles,
} from "../../api/api";
import ArticleCard from "../Main/Articles/ArticleCard";
import Avatar from "../UI/Avatar";
import Loading from "../UI/Loading";

function Dashboard() {
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [saved, setSaved] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser) return;

    Promise.all([
      fetchActivity(),
      fetchSavedArticles(),
      fetchDrafts(),
      fetchFollowing(),
    ])
      .then(([activityData, savedData, draftData, followingData]) => {
        setActivity(activityData);
        setSaved(savedData);
        setDrafts(draftData);
        setFollowing(followingData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [loggedUser]);

  if (isAuthLoading || isLoading) return <Loading />;
  if (!loggedUser) return null;

  const stats = activity?.stats || {};

  const activityLabel = (item) => {
    if (item.type === "article") return "Published an article";
    if (item.type === "comment") return "Commented on an article";
    if (item.type === "saved") return "Saved an article";
    if (item.type === "follow") return "Followed a member";
    return "Activity";
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-9 text-white shadow-xl sm:px-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-200">
          Your space
        </p>
        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Welcome back, {loggedUser.name}
            </h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Your publishing, reading and community activity in one place.
            </p>
          </div>
          <Link
            to="/articles/new"
            className="w-fit rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100"
          >
            + Write something
          </Link>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Published", stats.published_articles || 0],
          ["Drafts", stats.drafts || 0],
          ["Comments", stats.comments || 0],
          ["Saved", stats.saved_articles || 0],
          ["Following", stats.following || 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
                Saved
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Your reading list
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-400">{saved.length}</span>
          </div>

          <div className="mt-4 space-y-4">
            {saved.length ? (
              saved.slice(0, 4).map((article) => (
                <ArticleCard
                  key={article.article_id}
                  {...article}
                  img_url={article.article_img_url}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                Save an article and it will appear here.
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
            Recent activity
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Timeline</h2>
          <div className="mt-4 space-y-3">
            {(activity?.activity || []).slice(0, 10).map((item, index) => (
              <div
                key={item.type + "-" + item.resource_id + "-" + index}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-black uppercase tracking-wide text-indigo-600">
                  {activityLabel(item)}
                </p>
                <p className="mt-1 break-words font-bold text-slate-900">
                  {item.label}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {new Date(item.occurred_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-600">
                Private
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Drafts</h2>
            </div>
            <Link to="/articles/new" className="text-sm font-black text-indigo-600">
              New draft
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {drafts.length ? drafts.map((draft) => (
              <Link
                key={draft.article_id}
                to={"/articles/" + draft.article_id + "/edit"}
                className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black uppercase text-amber-700">
                      Draft
                    </span>
                    <h3 className="mt-3 text-lg font-black text-slate-950">{draft.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{draft.topic}</p>
                  </div>
                  <span className="text-sm font-black text-indigo-600">Continue →</span>
                </div>
              </Link>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-slate-500">
                No drafts yet.
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-600">
                Community
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Following</h2>
            </div>
            <Link to="/following" className="text-sm font-black text-indigo-600">
              Open feed
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {following.length ? following.map((user) => (
              <Link
                key={user.username}
                to={"/users/" + user.username}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300"
              >
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-950">{user.name}</p>
                  <p className="truncate text-sm text-slate-500">@{user.username}</p>
                </div>
              </Link>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-slate-500 sm:col-span-2">
                Follow writers from the Community page to build your feed.
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
