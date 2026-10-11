import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import {
  fetchArticles,
  fetchTrendingArticles,
  fetchTrendingTopics,
} from "../api/api";

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
  const [trending, setTrending] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      fetchArticles({ sort_by: "created_at", order: "desc", limit: 3 }),
      fetchTrendingArticles({ limit: 3 }),
      fetchTrendingTopics({ limit: 6 }),
    ]).then(([latestResult, trendingResult, topicResult]) => {
      if (latestResult.status === "fulfilled") {
        setLatest(latestResult.value);
      }
      if (trendingResult.status === "fulfilled") {
        setTrending(trendingResult.value);
      }
      if (topicResult.status === "fulfilled") {
        setTrendingTopics(topicResult.value);
      }
    });
  }, []);

  const previewStories = trending.length ? trending : latest;

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
              Read what matters. Follow the people and topics you care about.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore stories, see what is trending and build a personalised
              feed from writers and topics—all powered by NC News itself.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/articles"
                className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Explore stories
              </Link>
              <Link
                to="/trending"
                className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-5 py-3 font-bold text-amber-100 transition hover:bg-amber-300/15"
              >
                See what&apos;s hot
              </Link>
              <Link
                to={loggedUser ? "/following" : "/signup"}
                className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              >
                {loggedUser ? "Open your feed" : "Join the community"}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-indigo-950/30 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                  Hot now
                </p>
                <h2 className="mt-1 text-xl font-black">Worth a read</h2>
              </div>
              <Link
                to="/trending"
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
              Explore the conversation
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Trending topics
            </h2>
          </div>
          <Link to="/trending" className="text-sm font-black text-indigo-600">
            Open trending →
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {trendingTopics.length ? (
            trendingTopics.map((topic) => (
              <Link
                key={topic.slug}
                to={"/articles/topics/" + topic.slug}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <span className="font-black text-slate-950">{topic.slug}</span>
                <span className="ml-3 text-xs font-semibold text-slate-400">
                  {topic.article_count} stories · {topic.comment_count} comments
                </span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-500">Topics will appear here as the community grows.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Discover
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              Hot ranking
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Trending stories blend votes, discussion and freshness rather
              than relying on an external recommendation API.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Personalise
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              Follow writers and topics
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Build a feed around the people and subjects you actually want to
              read.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
              Participate
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              Publish and discuss
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Draft stories, publish them, reply in threads and keep ownership
              enforced by the backend.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
