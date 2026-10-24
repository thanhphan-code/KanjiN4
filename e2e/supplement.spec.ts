import { test, expect } from "@playwright/test";

test("nhóm bổ sung: tìm Romaji, che đáp án, quiz và khôi phục", async ({
  page,
}) => {
  await page.goto("/lessons/lesson-01/vocabulary");
  await page.getByRole("button", { name: "Mới bổ sung", exact: true }).click();
  await expect(page.locator(".vocabulary-count")).toContainText("13 từ");
  await expect(page.locator(".vocabulary-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Che cách đọc và nghĩa" }).click();
  await expect(page.locator(".vocabulary-cards rt")).toHaveCount(0);
  await expect(page.locator(".vocabulary-gloss")).toHaveCount(0);
  await page.getByRole("button", { name: "Hiện đáp án", exact: true }).click();
  await page.getByRole("searchbox", { name: "Tìm trong bài" }).fill("atatakai");
  await expect(page.locator(".vocabulary-card")).toHaveCount(1);
  await expect(page.locator(".vocabulary-card")).toContainText("暖かい");
  await page.getByRole("button", { name: "Quiz 2 câu", exact: true }).click();
  await expect(page.locator(".practice-top")).toContainText("Câu 1 / 2");
  await page.locator(".answer-choice").first().click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("status")).toBeVisible();
  const stem = await page.locator(".question-stem").textContent();
  await page.reload();
  await expect(page.locator(".question-stem")).toHaveText(stem!);
  await expect(page.getByRole("status")).toBeVisible();
});

test("bổ sung responsive, liên kết chi tiết và tìm toàn cục", async ({
  page,
}) => {
  await page.goto("/lessons/lesson-05/vocabulary");
  await page.getByRole("button", { name: "Mới bổ sung", exact: true }).click();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/supplement-${width}.png`,
      fullPage: true,
    });
  }
  await page.locator(".vocabulary-surface").first().click();
  await expect(page).toHaveURL(/\/library\/words\//);
  await page.goto("/library?q=atatakai");
  await expect(page.locator(".word-list")).toContainText("暖かい");
});
