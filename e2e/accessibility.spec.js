import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function mockPublicApi(page) {
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace(/^\/api/, "");

    const json = (body) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });

    if (path === "/topics" || path === "/topics/trending") {
      return json({
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
      return json({ articles: [] });
    }

    if (path === "/articles") {
      return json({
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

    return route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ msg: "Not Found" }),
    });
  });
}

for (const route of ["/", "/articles", "/login", "/signup"]) {
  test(route + " has no serious WCAG axe violations", async ({ page }) => {
    await mockPublicApi(page);
    await page.goto(route);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact)
    );

    expect(blocking).toEqual([]);
  });
}
