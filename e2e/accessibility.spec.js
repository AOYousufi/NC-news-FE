import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const authenticatedMember = {
  username: "sultan",
  name: "Sultan",
  avatar_url: null,
  bio: null,
  pinned_article_id: null,
  role: "user",
};

const accessibilityArticle = {
  article_id: 42,
  title: "Accessible test story",
  topic: "coding",
  author: "writer",
  body: "A concise article body used for accessibility coverage.",
  created_at: "2026-10-01T12:00:00.000Z",
  updated_at: "2026-10-01T12:00:00.000Z",
  votes: 3,
  article_img_url: null,
  comment_count: 0,
  status: "published",
};

function fulfillJson(route, body, status = 200) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function mockPublicApi(page) {
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/topics" || path === "/topics/trending") {
      return fulfillJson(route, {
        topics: [
          {
            slug: "coding",
            description: "Code and software",
            article_count: 1,
            comment_count: 2,
            trend_score: 5,
          },
        ],
      });
    }

    if (path === "/articles/trending") {
      return fulfillJson(route, { articles: [] });
    }

    if (path === "/articles") {
      return fulfillJson(route, {
        articles: [],
        pagination: {
          total_count: 0,
          page: 1,
          limit: 8,
          total_pages: 0,
          has_previous: false,
          has_next: false,
        },
      });
    }

    return fulfillJson(route, { msg: "Not Found" }, 404);
  });
}

async function mockAuthenticatedApi(page, { moderator = false } = {}) {
  const currentUser = {
    ...authenticatedMember,
    role: moderator ? "moderator" : "user",
  };

  await page.addInitScript(() => {
    localStorage.setItem("ncNewsToken", "axe-token");
  });

  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = route.request().method();

    if (path === "/users/me" && method === "GET") {
      return fulfillJson(route, { user: currentUser });
    }

    if (path === "/users/me/notifications/count" && method === "GET") {
      return fulfillJson(route, { unread_count: 0 });
    }

    if (path === "/users/me/activity" && method === "GET") {
      return fulfillJson(route, {
        stats: {
          published_articles: 0,
          drafts: 0,
          comments: 0,
          saved_articles: 0,
          following: 0,
        },
        activity: [],
      });
    }

    if (path === "/users/me/saved" && method === "GET") {
      return fulfillJson(route, { articles: [] });
    }

    if (path === "/users/me/following" && method === "GET") {
      return fulfillJson(route, { users: [] });
    }

    if (path === "/articles/drafts" && method === "GET") {
      return fulfillJson(route, { articles: [] });
    }

    if (path === "/users/me/notifications" && method === "GET") {
      return fulfillJson(route, { notifications: [], unread_count: 0 });
    }

    if (path === "/collections" && method === "GET") {
      return fulfillJson(route, { collections: [] });
    }

    if (path === "/articles" && method === "GET") {
      return fulfillJson(route, {
        articles: [],
        pagination: {
          total_count: 0,
          page: 1,
          limit: 8,
          total_pages: 0,
          has_previous: false,
          has_next: false,
        },
      });
    }

    if (path === "/articles/42" && method === "GET") {
      return fulfillJson(route, { article: [accessibilityArticle] });
    }

    if (path === "/articles/42/recommendations" && method === "GET") {
      return fulfillJson(route, { articles: [] });
    }

    if (path === "/articles/42/reactions" && method === "GET") {
      return fulfillJson(route, {
        reactions: { insightful: 0, useful: 0, funny: 0 },
      });
    }

    if (path === "/articles/42/reaction" && method === "GET") {
      return fulfillJson(route, { reaction: null, can_react: true });
    }

    if (path === "/articles/42/vote" && method === "GET") {
      return fulfillJson(route, { vote: 0, can_vote: true });
    }

    if (path === "/articles/42/comments" && method === "GET") {
      return fulfillJson(route, { comments: [] });
    }

    if (path === "/articles/42/comment-votes" && method === "GET") {
      return fulfillJson(route, { votes: [] });
    }

    if (path === "/moderation/reports" && method === "GET") {
      return fulfillJson(route, { reports: [] });
    }

    return fulfillJson(route, { msg: "Not Found" }, 404);
  });
}

async function expectNoBlockingAxeViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact)
  );

  expect(blocking).toEqual([]);
}

for (const route of ["/", "/articles", "/login", "/signup"]) {
  test(route + " has no serious WCAG axe violations", async ({ page }) => {
    await mockPublicApi(page);
    await page.goto(route);
    await expectNoBlockingAxeViolations(page);
  });
}

for (const route of [
  "/dashboard",
  "/userProfile",
  "/settings",
  "/notifications",
  "/collections",
  "/articles/42",
]) {
  test(route + " authenticated view has no serious WCAG axe violations", async ({ page }) => {
    await mockAuthenticatedApi(page);
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await expectNoBlockingAxeViolations(page);
  });
}

test("/moderation moderator view has no serious WCAG axe violations", async ({ page }) => {
  await mockAuthenticatedApi(page, { moderator: true });
  await page.goto("/moderation");
  await page.waitForLoadState("networkidle");
  await expectNoBlockingAxeViolations(page);
});

test("mobile authenticated dashboard has no serious WCAG axe violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockAuthenticatedApi(page);
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
  await expectNoBlockingAxeViolations(page);
});
