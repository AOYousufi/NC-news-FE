import { expect, test } from "@playwright/test";

test("article search keeps URL state", async ({ page }) => {
  await page.route("**/api/topics", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ topics: [] }),
    });
  });

  await page.route("**/api/articles**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        articles: [],
        pagination: {
          total_count: 0,
          page: 1,
          limit: 8,
          total_pages: 0,
          has_previous: false,
          has_next: false
        }
      }),
    });
  });

  await page.goto("/articles");
  await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();

  const search = page.getByPlaceholder("Search stories, article text or authors...");
  await search.fill("coding");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/search=coding/);
  await expect(page.getByText("Results for “coding”")).toBeVisible();
});
