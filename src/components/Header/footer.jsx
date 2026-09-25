function Footer() {
  return (
    <footer className="footer footer-center bg-gray-100 text-gray-700 p-10">
      <nav className="grid grid-flow-col gap-4">
        <a
          target="_blank"
          href="https://northcoders.com/"
          className="link link-hover text-gray-600 hover:text-gray-900"
        >
          About Us
        </a>
        <a
          target="_blank"
          href="https://github.com/AOYousufi"
          className="link link-hover text-gray-600 hover:text-gray-900"
        >
          Contact
        </a>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a
            target="_blank"
            href="https://www.youtube.com/northcoders"
            aria-label="YouTube"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current text-gray-600 hover:text-red-600"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </a>
          <a
            target="_blank"
            href="https://www.facebook.com/northcoders"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current text-gray-600 hover:text-blue-600"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </a>
        </div>
      </nav>
      <aside className="mt-4">
        <p className="text-sm text-gray-500">
          Copyright © {new Date().getFullYear()} - All rights reserved by
          Northcoders
        </p>
      </aside>
    </footer>
  );
}

export default Footer;
