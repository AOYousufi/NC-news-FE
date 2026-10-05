import { Link } from "react-router-dom";

function Error({ error }) {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-500">
          {error.status ? "Error " + error.status : "Something went wrong"}
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">
          We could not load this page
        </h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          {error.message}
        </p>
        <Link
          to="/articles"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          Back to articles
        </Link>
      </div>
    </section>
  );
}

export default Error;
