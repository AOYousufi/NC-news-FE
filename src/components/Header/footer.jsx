function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-black text-slate-900">
            NC<span className="text-indigo-600">News</span>
          </p>
          <p className="mt-1">A full-stack news community project.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/AOYousufi/NC-news-FE"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition hover:text-slate-900"
          >
            Frontend
          </a>
          <a
            href="https://github.com/AOYousufi/NC-News-BE"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition hover:text-slate-900"
          >
            Backend
          </a>
          <a
            href="https://github.com/AOYousufi"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition hover:text-slate-900"
          >
            GitHub
          </a>
        </div>

        <p>© {new Date().getFullYear()} Ahmad Ozair Yousufi</p>
      </div>
    </footer>
  );
}

export default Footer;
