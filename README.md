# NC News - Frontend

A React frontend for the NC News REST API. The app supports public article browsing with authenticated voting, commenting and profile management.

## Live links

- **Frontend:** https://nc-news-sultan.netlify.app/
- **API:** https://nc-news-vvdv.onrender.com/api
- **Backend repo:** https://github.com/AOYousufi/NC-News-BE

## Features

- Browse articles and topics without an account
- Sort articles by date, votes or comment count
- Register and log in with the backend authentication API
- Persistent bearer-token sessions
- Vote on articles while authenticated
- Post comments as the authenticated user
- Delete only your own comments
- View and update your profile
- Responsive layout, loading states and API error handling
- Netlify SPA routing support

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 18 |
| Routing | React Router |
| HTTP | Axios |
| Styling | Tailwind CSS + DaisyUI |
| Build | Vite |
| Hosting | Netlify |
| API | Node.js / Express / PostgreSQL backend on Render |

## Local setup

```bash
git clone https://github.com/AOYousufi/NC-news-FE.git
cd NC-news-FE
npm install
cp .env.example .env
npm run dev
```

The frontend defaults to the live API if `VITE_API_URL` is not set.

## Environment

```text
VITE_API_URL=https://nc-news-vvdv.onrender.com/api
```

This is a public frontend configuration value, not a secret. Authentication tokens are created by the backend after login/registration.

## Checks

```bash
npm run lint
npm run build
```

GitHub Actions runs both checks on pushes to `main` and pull requests.
