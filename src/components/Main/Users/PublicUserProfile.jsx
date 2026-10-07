import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../../../Context/userContext";
import {
  fetchArticles,
  fetchFollowStatus,
  fetchUser,
  fetchUserComments,
  fetchUserStats,
  followUser,
  unfollowUser,
} from "../../../api/api";
import ArticleCard from "../Articles/ArticleCard";
import Avatar from "../../UI/Avatar";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";

function PublicUserProfile() {
  const { username } = useParams();
  const { loggedUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isSelf = loggedUser?.username === username;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setActiveTab("articles");

    Promise.all([
      fetchUser(username),
      fetchArticles({
        author: username,
        sort_by: "created_at",
        order: "desc",
      }),
      fetchUserStats(username),
      fetchUserComments(username),
    ])
      .then(([userData, articleData, statsData, commentData]) => {
        setUser(userData);
        setArticles(articleData);
        setStats(statsData);
        setComments(commentData);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [username]);

  useEffect(() => {
    if (!loggedUser || isSelf) {
      setIsFollowing(false);
      return;
    }

    let active = true;

    fetchFollowStatus(username)
      .then(({ following }) => {
        if (active) setIsFollowing(following);
      })
      .catch(() => {
        if (active) setIsFollowing(false);
      });

    return () => {
      active = false;
    };
  }, [isSelf, loggedUser, username]);

  const toggleFollow = async () => {
    if (!loggedUser || isSelf || isFollowLoading) return;

    const previous = isFollowing;
    setIsFollowing(!previous);
    setIsFollowLoading(true);

    try {
      if (previous) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
    } catch (err) {
      setIsFollowing(previous);
      setError(err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (error) return <Error error={error} />;
  if (isLoading || !user) return <Loading />;

  const tabs = [
    ["articles", "Articles", stats?.articles ?? articles.length],
    ["comments", "Comments", stats?.comments ?? comments.length],
    ["about", "About", null],
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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

            {!isSelf &&
              (loggedUser ? (
                <button
                  type="button"
                  onClick={toggleFollow}
                  disabled={isFollowLoading}
                  aria-pressed={isFollowing}
                  className={
                    "w-fit rounded-xl px-5 py-3 text-sm font-black transition disabled:opacity-60 " +
                    (isFollowing
                      ? "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                      : "bg-white text-slate-950 hover:bg-slate-100")
                  }
                >
                  {isFollowLoading
                    ? "Updating..."
                    : isFollowing
                      ? "✓ Following"
                      : "+ Follow"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-fit rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950"
                >
                  Sign in to follow
                </Link>
              ))}
          </div>
        </div>

        <div className="grid gap-3 border-b border-slate-100 px-6 py-5 sm:grid-cols-3 lg:grid-cols-6 sm:px-10">
          {[
            ["Articles", stats?.articles ?? articles.length],
            ["Comments", stats?.comments ?? comments.length],
            ["Followers", stats?.followers ?? 0],
            ["Following", stats?.following ?? 0],
            ["Article votes", stats?.article_votes_received ?? 0],
            ["Comment votes", stats?.comment_votes_received ?? 0],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Profile sections">
            {tabs.map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={activeTab === value}
                onClick={() => setActiveTab(value)}
                className={
                  "rounded-xl px-4 py-2 text-sm font-black transition " +
                  (activeTab === value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }
              >
                {label}
                {count !== null ? " · " + count : ""}
              </button>
            ))}
          </div>

          <Link
            to="/users"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            Back to community
          </Link>
        </div>
      </div>

      {activeTab === "articles" && (
        <div className="mt-8">
          <h2 className="text-3xl font-black text-slate-950">
            Articles by {user.name}
          </h2>

          {articles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              This user has not published any articles yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {articles.map((article) => (
                <ArticleCard
                  key={article.article_id}
                  {...article}
                  img_url={article.article_img_url}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "comments" && (
        <div className="mt-8">
          <h2 className="text-3xl font-black text-slate-950">
            Comments by {user.name}
          </h2>

          {comments.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No public comments yet.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {comments.map((comment) => (
                <Link
                  key={comment.comment_id}
                  to={"/articles/" + comment.article_id}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <p className="text-xs font-black uppercase tracking-wide text-indigo-600">
                    On {comment.article_title}
                  </p>
                  <p className="mt-3 leading-7 text-slate-700">{comment.body}</p>
                  <div className="mt-3 flex gap-3 text-xs font-bold text-slate-400">
                    <span>{comment.votes} votes</span>
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "about" && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
            About this member
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{user.name}</h2>
          <p className="mt-3 leading-7 text-slate-600">
            @{user.username} has published {stats?.articles ?? articles.length}{" "}
            {(stats?.articles ?? articles.length) === 1 ? "article" : "articles"} and
            contributed {stats?.comments ?? comments.length}{" "}
            {(stats?.comments ?? comments.length) === 1 ? "comment" : "comments"} to
            the NC News community.
          </p>
        </div>
      )}
    </section>
  );
}

export default PublicUserProfile;
