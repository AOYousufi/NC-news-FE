# NC News - Frontend

A polished React frontend for the NC News REST API. Guests can browse the full public news experience, while authenticated users can vote, comment and manage their profile.

## Live links

- **Frontend:** https://nc-news-sultan.netlify.app/
- **API:** https://nc-news-vvdv.onrender.com/api
- **Backend repo:** https://github.com/AOYousufi/NC-News-BE

## Features

### Public experience

- Browse articles without an account
- Topic navigation and URL-based sorting
- Authenticated topic creation directly from the article editor
- Paginated article feed
- Public community directory
- Public user profiles with each user's articles
- Read article discussions as a guest
- Dynamic home page with popular stories

### User management

- Register with username/password
- Log in with the backend authentication API
- Choice between browser-session sign-in and persistent device sign-in
- Automatic current-user restoration
- Expired/invalid session cleanup
- Update profile name and avatar
- View your public profile

### Authenticated actions

- Create and publish articles as the authenticated user
- Edit only your own article content
- Delete only your own articles with an explicit confirmation step
- Vote on other users' articles with persistent Agree/Disagree state and instant switching
- Post comments as the authenticated user
- Delete only your own comments

### Quality

- Responsive layout
- Reusable accessible create/edit article editor
- Owner-only article management controls
- Loading, empty and error states
- Netlify SPA routing support
- Environment-based API URL
- GitHub Actions lint and production-build checks

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 18 |
| Routing | React Router |
| HTTP | Axios |
| Styling | Tailwind CSS + DaisyUI |
| Build | Vite |
| Hosting | Netlify |
| API | Node.js / Express / PostgreSQL on Render |

## Local setup

```bash
git clone https://github.com/AOYousufi/NC-news-FE.git
cd NC-news-FE
npm install
cp .env.example .env
npm run dev
```

## Environment

```text
VITE_API_URL=https://nc-news-vvdv.onrender.com/api
```

`VITE_API_URL` is public frontend configuration, not a secret. Authentication tokens are issued by the backend after login or registration.

## Checks

```bash
npm run lint
npm run build
```

GitHub Actions runs both checks on pushes to `main` and pull requests.
