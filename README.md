# NC News - Frontend

A production-style React frontend for the NC News community publishing platform.

The app supports public browsing plus authenticated publishing, social discovery, saved reading lists, reactions, notifications, moderation and account management.

## Live links

- **Frontend:** https://nc-news-sultan.netlify.app/
- **API:** https://nc-news-vvdv.onrender.com/api
- **Backend repo:** https://github.com/AOYousufi/NC-News-BE

## Product features

### Discovery

- Home page with Hot stories and trending topics
- article search
- topic, author and date-range filtering
- sorting + pagination
- dedicated Trending page
- "More like this" recommendations
- public user directory
- public profile contribution stats

### Personalisation

- follow writers
- follow topics
- personalised Following feed
- bookmarks/Saved articles
- private named Collections
- Dashboard with activity, drafts, Saved and following state

### Publishing

- create articles
- private drafts
- edit/publish/unpublish flow
- local browser autosave recovery
- article preview before publishing
- revision history
- owner-only edit/delete controls
- featured/pinned profile story
- profile bio

### Voting and reactions

- persistent Agree/Disagree state
- instant switching/removal without refresh
- self-voting blocked
- **Insightful**, **Useful** and **Funny** reactions
- one active reaction per user/article
- persistent comment voting

### Discussion

- comments
- nested replies
- collapsible reply trees
- comment editing
- comment deletion with tombstone rendering
- @mention guidance and mention notifications

### Reading experience

- estimated reading time
- reading progress bar
- recommendations
- article collections

### Notifications

- unread count
- follow notifications
- comment/reply notifications
- article vote notifications
- @mention notifications
- mark one/all as read

### Moderation

- report article/comment controls
- moderator-only section
- report queue
- resolve/dismiss workflow
- platform analytics
- moderation audit history

### Account management

- register/login
- persistent or browser-session login choice
- current-user restoration
- expired-session cleanup
- avatar/profile editing
- bio + featured story
- password change
- account deletion

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 18 |
| Routing | React Router |
| HTTP | Axios |
| Styling | Tailwind CSS |
| Build | Vite |
| Browser testing | Playwright |
| Accessibility | axe-core + Playwright |
| Hosting | Netlify |
| API | Node.js / Express / PostgreSQL |

## Quality gates

Every push to `main` is checked by GitHub Actions.

### Frontend checks

```bash
npm ci
npm run lint
npm run build
npm run budget
```

The performance budget fails CI if the compressed frontend bundle grows beyond the configured thresholds.

### Browser E2E

Playwright covers important flows including:

- session restoration
- search URL state
- draft creation
- bookmark/vote switching
- article reactions
- follows
- report/moderation flow
- mobile navigation and overflow

### Accessibility

axe-core checks key public pages against WCAG A/AA rules and fails CI on serious/critical violations.

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

`VITE_API_URL` is public client configuration, not a secret.

## Useful commands

```bash
npm run dev
npm run lint
npm run build
npm run budget
npm run preview
```

## Architecture notes

Authentication tokens are stored in either `sessionStorage` or `localStorage` depending on the user's sign-in choice.

Frontend ownership checks are only presentation logic. The backend remains authoritative for permissions, ownership, draft privacy, moderator access, voting and account mutations.

The app does not depend on an external search, recommendation or notification service. Search, trending, recommendations, follows, collections and notifications are backed by the NC News API/PostgreSQL.
