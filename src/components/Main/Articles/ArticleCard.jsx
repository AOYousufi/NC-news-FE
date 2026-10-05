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
    <Link
      to={"/articles/" + article_id}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
    >
      <article className="grid min-h-full sm:grid-cols-[220px_1fr]">
        <div className="overflow-hidden bg-slate-100">
          <img
            src={img_url}
            alt=""
            className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-full"
          />
        </div>

        <div className="flex flex-col p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
              {topic}
            </span>
            <span>{date}</span>
          </div>

          <h2 className="mt-3 text-xl font-black leading-snug text-slate-950 transition group-hover:text-indigo-700 sm:text-2xl">
            {title}
          </h2>

          <p className="mt-2 text-sm text-slate-500">By {author}</p>

          <div className="mt-auto flex flex-wrap gap-4 pt-5 text-sm font-semibold text-slate-600">
            <span>{votes} votes</span>
            <span>{comment_count} comments</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
