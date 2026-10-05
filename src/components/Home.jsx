import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/userContext";

function Home() {
  const { loggedUser } = useContext(UserContext);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.35),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.22),_transparent_32%)]" />

      <div className="relative mx-auto grid min-h-[74vh] max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-indigo-300">
            Community news, without the noise
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
            Read what matters. Join the conversation when you want.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Browse articles by topic, sort the feed, read comments as a guest,
            or sign in to vote and take part in the discussion.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/articles"
              className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-100"
            >
              Browse articles
            </Link>
            <Link
              to={loggedUser ? "/userProfile" : "/signup"}
              className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10"
            >
              {loggedUser ? "View profile" : "Create an account"}
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-950/30 backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm font-semibold text-indigo-200">Guests</p>
              <p className="mt-2 text-2xl font-black">Read freely</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Articles, topics and comments stay public. No account wall.
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-500/20 p-5">
              <p className="text-sm font-semibold text-indigo-200">Members</p>
              <p className="mt-2 text-2xl font-black">Join in</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Vote, comment, manage your profile and delete your own comments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
