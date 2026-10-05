import { Link } from "react-router-dom";

const ArticleCard = ({
  title,
  topic,
  img_url,
  article_id,
  votes,
  created_at,
  author,
  comment_count,
}) => {
  const date = new Date(created_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="grid min-h-full sm:grid-cols-[220px_1fr]">
        <Link
          to={"/articles/" + article_id}
          className="overflow-hidden bg-slate-100"
          aria-label={"Read " + title}
        >
          <img
            src={img_url}
            alt=""
            className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-full"
          />
        </Link>

        <div className="flex flex-col p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Link
              to={"/articles/topics/" + topic}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700 transition hover:bg-indigo-100"
            >
              {topic}
            </Link>
            <span>{date}</span>
          </div>

          <Link to={"/articles/" + article_id}>
            <h2 className="mt-3 text-xl font-black leading-snug text-slate-950 transition group-hover:text-indigo-700 sm:text-2xl">
              {title}
            </h2>
          </Link>

          <p className="mt-2 text-sm text-slate-500">
            By{" "}
            <Link
              to={"/users/" + author}
              className="font-bold text-slate-700 hover:text-indigo-700"
            >
              @{author}
            </Link>
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
            <div className="flex gap-4 text-sm font-semibold text-slate-600">
              <span>{votes} votes</span>
              <span>{comment_count} comments</span>
            </div>
            <Link
              to={"/articles/" + article_id}
              className="text-sm font-black text-indigo-600 transition group-hover:text-indigo-700"
            >
              Read story →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
