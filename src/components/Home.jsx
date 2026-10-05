import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import { fetchArticles } from "../api/api";

function StoryPreview({ article }) {
  return (
    <Link
      to={"/articles/" + article.article_id}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex gap-4">
        <img
          src={article.article_img_url}
          alt=""
          className="h-20 w-24 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-300">
            {article.topic}
          </p>
          <h3 className="mt-1 line-clamp-2 font-black leading-snug text-white group-hover:text-indigo-200">
            {article.title}
          </h3>
          <p className="mt-2 text-xs text-slate-400">
            {article.votes} votes · {article.comment_count} comments
          </p>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const { loggedUser } = useContext(UserContext);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      fetchArticles({ sort_by: "created_at", order: "desc", limit: 3 }),
      fetchArticles({ sort_by: "votes", order: "desc", limit: 3 }),
    ]).then(([latestResult, popularResult]) => {
      if (latestResult.status === "fulfilled") {
        setLatest(latestResult.value);
      }
      if (popularResult.status === "fulfilled") {
        setPopular(popularResult.value);
      }
    });
  }, []);

  const previewStories = popular.length ? popular : latest;

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.38),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.22),_transparent_32%)]" />

        <div className="relative mx-auto grid min-h-[72vh] max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-indigo-300">
              Community news, without the noise
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              Read what matters. Join the conversation when you want.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore articles by topic, discover writers in the community and
              join the discussion with a simple account.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/articles"
                className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Explore stories
              </Link>
              <Link
                to={loggedUser ? "/userProfile" : "/signup"}
                className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              >
                {loggedUser ? "View profile" : "Join the community"}
              </Link>
              <Link
                to="/users"
                className="rounded-xl px-5 py-3 font-bold text-indigo-200 transition hover:text-white"
              >
                Meet the community →
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-indigo-950/30 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
                  Popular now
                </p>
                <h2 className="mt-1 text-xl font-black">Worth a read</h2>
              </div>
              <Link
                to="/articles"
                className="text-sm font-bold text-slate-300 hover:text-white"
              >
                See all
              </Link>
            </div>

            <div className="space-y-3">
              {previewStories.length ? (
                previewStories.map((article) => (
                  <StoryPreview key={article.article_id} article={article} />
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 p-5 text-sm text-slate-400">
                  Stories will appear here once the API is available.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Browse freely
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              No account wall
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Articles, topics, profiles and comments stay public for guests.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Join in
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              Vote and comment
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Sign in when you want to participate. Your identity comes from
              your authenticated session.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Own your space
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              Profiles and ownership
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Update your profile and manage the comments that belong to you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
