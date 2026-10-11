import { expect, test } from "@playwright/test";

const member = {
  username: "sultan",
  name: "Sultan",
  avatar_url: null,
  role: "user",
};

const moderator = {
  ...member,
  username: "moderator",
  name: "Moderator",
  role: "moderator",
};

const otherUser = {
  username: "writer",
  name: "Writer",
  avatar_url: null,
};

const article = {
  article_id: 42,
  title: "A test story",
  topic: "coding",
  author: "writer",
  body: "This is the body of the article.",
  created_at: "2026-10-01T12:00:00.000Z",
  updated_at: "2026-10-01T12:00:00.000Z",
  votes: 3,
  article_img_url: null,
  comment_count: 0,
  status: "published",
};

async function mockApi(page, { currentUser = member } = {}) {
  const state = {
    saved: false,
    vote: 0,
    following: false,
    createdArticle: null,
    reportCreated: false,
    reportStatus: "open",
  };

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    const json = async (status, body) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
      });

    if (path === "/users/me" && method === "GET") {
      return json(200, { user: currentUser });
    }

    if (path === "/topics" && method === "GET") {
      return json(200, {
        topics: [
          { slug: "coding", description: "Code and software" },
          { slug: "football", description: "Football" },
        ],
      });
    }

    if (path === "/articles" && method === "POST") {
      const body = request.postDataJSON();
      state.createdArticle = {
        ...article,
        ...body,
        article_id: 99,
        author: currentUser.username,
        votes: 0,
        comment_count: 0,
      };
      return json(201, { article: state.createdArticle });
    }

    if (path === "/articles" && method === "GET") {
      return json(200, {
        articles: [article],
        pagination: {
          total_count: 1,
          page: 1,
          limit: 8,
          total_pages: 1,
          has_previous: false,
          has_next: false,
        },
      });
    }

    if (path === "/articles/42" && method === "GET") {
      return json(200, { article: [article] });
    }

    if (path === "/articles/42/comments" && method === "GET") {
      return json(200, { comments: [] });
    }

    if (path === "/articles/42/comment-votes" && method === "GET") {
      return json(200, { votes: [] });
    }

    if (path === "/articles/42/vote" && method === "GET") {
      return json(200, { vote: state.vote, can_vote: true });
    }

    if (path === "/articles/42" && method === "PATCH") {
      const body = request.postDataJSON();

      if (Object.prototype.hasOwnProperty.call(body, "inc_votes")) {
        const choice = body.inc_votes;
        state.vote = state.vote === choice ? 0 : choice;
        return json(200, {
          article: {
            ...article,
            votes: article.votes + state.vote,
            user_vote: state.vote,
          },
        });
      }

      return json(200, { article: { ...article, ...body } });
    }

    if (path === "/users/me/saved" && method === "GET") {
      return json(200, { articles: state.saved ? [article] : [] });
    }

    if (path === "/articles/42/save" && method === "POST") {
      state.saved = true;
      return route.fulfill({ status: 204 });
    }

    if (path === "/articles/42/save" && method === "DELETE") {
      state.saved = false;
      return route.fulfill({ status: 204 });
    }

    if (path === "/users/writer" && method === "GET") {
      return json(200, otherUser);
    }

    if (path === "/users/writer/stats" && method === "GET") {
      return json(200, {
        stats: {
          articles: 1,
          comments: 0,
          followers: 2,
          following: 1,
          article_votes_received: 3,
          comment_votes_received: 0,
        },
      });
    }

    if (path === "/users/writer/comments" && method === "GET") {
      return json(200, { comments: [] });
    }

    if (path === "/users/writer/follow-status" && method === "GET") {
      return json(200, { following: state.following, is_self: false });
    }

    if (path === "/users/writer/follow" && method === "POST") {
      state.following = true;
      return route.fulfill({ status: 204 });
    }

    if (path === "/users/writer/follow" && method === "DELETE") {
      state.following = false;
      return route.fulfill({ status: 204 });
    }

    if (path === "/reports" && method === "POST") {
      state.reportCreated = true;
      return json(201, {
        report: {
          report_id: 7,
          reporter_username: currentUser.username,
          target_type: "article",
          article_id: 42,
          comment_id: null,
          reason: "spam",
          details: "",
          status: "open",
        },
      });
    }

    if (path === "/moderation/reports" && method === "GET") {
      return json(200, {
        reports: [
          {
            report_id: 7,
            reporter_username: "sultan",
            target_type: "article",
            article_id: 42,
            comment_id: null,
            reason: "spam",
            details: "Looks suspicious",
            status: state.reportStatus,
            created_at: "2026-10-01T12:00:00.000Z",
            article_title: article.title,
            comment_body: null,
          },
        ].filter(
          (item) =>
            url.searchParams.get("status") === "all" ||
            item.status === (url.searchParams.get("status") || "open")
        ),
      });
    }

    if (path === "/moderation/reports/7" && method === "PATCH") {
      state.reportStatus = request.postDataJSON().status;
      return json(200, {
        report: {
          report_id: 7,
          status: state.reportStatus,
          reviewer_username: currentUser.username,
        },
      });
    }

    if (path === "/users/me/notifications/count" && method === "GET") {
      return json(200, { unread_count: 0 });
    }

    if (path === "/users/me/activity" && method === "GET") {
      return json(200, {
        stats: {
          published_articles: 0,
          drafts: 0,
          comments: 0,
          saved_articles: state.saved ? 1 : 0,
          following: state.following ? 1 : 0,
        },
        activity: [],
      });
    }

    if (path === "/articles/drafts" && method === "GET") {
      return json(200, { articles: [] });
    }

    if (path === "/users/me/following" && method === "GET") {
      return json(200, { users: state.following ? [otherUser] : [] });
    }

    return json(404, { msg: "Not Found" });
  });

  return state;
}

async function setAuthenticatedSession(page) {
  await page.addInitScript(() => {
    localStorage.setItem("ncNewsToken", "e2e-token");
  });
}

test("restores an authenticated session after refresh", async ({ page }) => {
  await setAuthenticatedSession(page);
  await mockApi(page);

  await page.goto("/dashboard");
  await expect(page.getByText("Welcome back, Sultan")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Welcome back, Sultan")).toBeVisible();
});

test("creates a draft from the publisher", async ({ page }) => {
  await setAuthenticatedSession(page);
  const state = await mockApi(page);

  await page.goto("/articles/new");

  await page.getByLabel("Article title").fill("My draft");
  await page.getByLabel("Topic").selectOption("coding");
  await page.getByLabel("Article body").fill("Draft body");
  await page.getByRole("button", { name: "Save draft" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  expect(state.createdArticle?.status).toBe("draft");
  expect(state.createdArticle?.author).toBe("sultan");
});

test("saves and switches article votes without refreshing", async ({ page }) => {
  await setAuthenticatedSession(page);
  const state = await mockApi(page);

  await page.goto("/articles/42");

  await page.getByRole("button", { name: "☆ Save" }).click();
  await expect(page.getByRole("button", { name: "★ Saved" })).toBeVisible();
  expect(state.saved).toBe(true);

  await page.getByRole("button", { name: "Agree", exact: true }).click();
  await expect(page.getByRole("button", { name: "✓ Agreed", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Disagree", exact: true }).click();
  await expect(page.getByRole("button", { name: "✓ Disagreed", exact: true })).toBeVisible();
  expect(state.vote).toBe(-1);
});

test("follows a writer from their public profile", async ({ page }) => {
  await setAuthenticatedSession(page);
  const state = await mockApi(page);

  await page.goto("/users/writer");

  await page.getByRole("button", { name: "+ Follow" }).click();
  await expect(page.getByRole("button", { name: "✓ Following" })).toBeVisible();
  expect(state.following).toBe(true);
});

test("submits a report and moderator can resolve it", async ({ page }) => {
  await setAuthenticatedSession(page);
  const memberState = await mockApi(page);

  await page.goto("/articles/42");
  await page.getByRole("button", { name: "Report" }).click();
  await page.getByRole("button", { name: "Submit report" }).click();
  expect(memberState.reportCreated).toBe(true);

  await page.unroute("**/api/**");
  await mockApi(page, { currentUser: moderator });

  await page.goto("/moderation");
  await expect(page.getByRole("heading", { name: "Moderation queue" })).toBeVisible();
  await page.getByRole("button", { name: "Resolve" }).click();
  await expect(page.getByText("No open reports.")).toBeVisible();
});

test("mobile navigation is usable without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockApi(page);

  await page.goto("/articles");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("link", { name: "Community" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();

  const sizes = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));

  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport);
});
