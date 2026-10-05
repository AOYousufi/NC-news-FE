import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div>
          <p className="font-black text-slate-900">
            NC<span className="text-indigo-600">News</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            A full-stack community news project built with React, Express and
            PostgreSQL.
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <p className="mb-1 font-black text-slate-900">Explore</p>
          <Link to="/articles" className="text-slate-500 hover:text-slate-900">
            Articles
          </Link>
          <Link to="/users" className="text-slate-500 hover:text-slate-900">
            Community
          </Link>
        </nav>

        <nav className="flex flex-col gap-2 text-sm">
          <p className="mb-1 font-black text-slate-900">Project</p>
          <a
            href="https://github.com/AOYousufi/NC-news-FE"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-slate-900"
          >
            Frontend source
          </a>
          <a
            href="https://github.com/AOYousufi/NC-News-BE"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-slate-900"
          >
            Backend source
          </a>
        </nav>

        <p className="border-t border-slate-100 pt-6 text-xs text-slate-400 md:col-span-3">
          © {new Date().getFullYear()} Ahmad Ozair Yousufi
        </p>
      </div>
    </footer>
  );
}

export default Footer;
