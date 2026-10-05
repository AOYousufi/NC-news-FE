import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
          404
        </p>
        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link
          to="/"
          className="mt-7 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          Go home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
