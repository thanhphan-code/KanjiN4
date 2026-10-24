import { test, expect } from "@playwright/test";
test("học bài, làm sai, khôi phục phiên, xem kết quả và ôn", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".lesson-card")).toHaveCount(15);
  await page.getByRole("link", { name: /Bắt đầu Bài 01/ }).click();
  await expect(page.locator(".kanji-paper")).toContainText("春");
  await page.getByRole("link", { name: "Luyện tập", exact: true }).click();
  await page.getByRole("button", { name: /Làm bài kiểm tra/ }).click();
  await expect(page).toHaveURL(/\/practice\//);
  const url = page.url();
  for (let i = 0; i < 8; i++) {
    await expect(page.locator(".practice-top")).toContainText(
      `Câu ${i + 1} / 8`,
    );
    const stem = await page.locator(".question-stem").textContent();
    await page.locator(".answer-choice").first().click();
    await page
      .getByRole("button", { name: "Lưu câu trả lời", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Đã lưu");
    if (i === 2) {
      await page.reload();
      await expect(page.locator(".question-stem")).toHaveText(stem!);
      await expect(page.getByRole("status")).toContainText("Đã lưu");
    }
    await page
      .getByRole("button", {
        name: i === 7 ? "Xem kết quả" : "Câu tiếp theo",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Bạn đã hoàn thành lượt học." }),
  ).toBeVisible();
  await expect(page.locator(".result-answer")).toHaveCount(8);
  await page.goto("/review");
  await expect(
    page.getByRole("heading", { name: /mục đang chờ bạn/ }),
  ).toBeVisible();
  await page.goto(url);
  await expect(page.locator(".result-answer")).toHaveCount(8);
});
test("Bài 05, tra cứu không dấu, ẩn ruby và nhập cách đọc", async ({
  page,
}) => {
  await page.goto("/lessons/lesson-05?kanji=k-%E7%97%85");
  await expect(page.locator(".kanji-paper")).toContainText("病");
  await page.getByRole("button", { name: "Ẩn Hiragana" }).click();
  await expect(page.locator("rt")).toHaveCount(0);
  await page.goto("/library?q=benh%20vien");
  await expect(page.locator(".word-list")).toContainText("病院");
  await page.goto("/lessons/lesson-05/practice");
  await page.getByRole("button", { name: /Nhập cách đọc/ }).click();
  await page.getByLabel("Cách đọc của từ").fill("まちがい");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Chưa đúng");
  await page.goto("/review");
  await expect(
    page.getByRole("heading", { name: /mục đang chờ bạn/ }),
  ).toBeVisible();
});
test("responsive, dark mode và bản đọc ẩn mặc định", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".lesson-card")).toHaveCount(15);
  await page.evaluate(() => document.fonts.ready);
  for (const width of [1440, 768, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() =>
      Array.from(document.querySelectorAll("body *"))
        .filter(
          (el) =>
            el.getBoundingClientRect().right > innerWidth + 1 &&
            getComputedStyle(el).position !== "fixed",
        )
        .map((el) => ({
          class: el.className,
          right: el.getBoundingClientRect().right,
        }))
        .slice(0, 15),
    );
    if (overflow.length) console.log("Overflow", width, overflow);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: width === 1440,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Không tràn ngang tại ${width}px`,
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: width === 1440,
    });
  }
  await page.goto("/reading/passage-1");
  await expect(page.locator(".reading-line")).toHaveCount(0);
  await page.getByRole("button", { name: "Xem cách đọc" }).click();
  await expect(page.locator(".reading-line")).toBeVisible();
  await page.goto("/settings");
  await page.getByLabel("Giao diện", { exact: false }).selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("offline sau precache và các màn học 320px", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.locator(".lesson-card")).toHaveCount(15);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.goto("/lessons/lesson-05?kanji=k-%E7%97%85");
  await expect(page.locator(".kanji-paper")).toContainText("病");
  await page.setViewportSize({ width: 320, height: 850 });
  for (const path of [
    "/lessons/lesson-05",
    "/lessons/lesson-05/vocabulary",
    "/lessons/lesson-05/examples",
    "/lessons/lesson-05/practice",
    "/library?q=benh",
    "/reading/passage-1",
    "/settings",
    "/progress",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBe(true);
  }
  await page.goto("/lessons/lesson-05?kanji=k-%E7%97%85");
  await page.screenshot({
    path: "test-results/lesson-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/lesson-desktop.png",
    fullPage: true,
  });
  await page.goto("/lessons/lesson-05/practice");
  await page.getByRole("button", { name: /Nhập cách đọc/ }).click();
  await page.getByLabel("Cách đọc của từ").fill("まちがい");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.locator(".answer-feedback")).toContainText("Chưa đúng");
});
test("xuất nhập backup qua giao diện và chặn JSON sai", async ({ page }) => {
  await page.goto("/lessons/lesson-01/practice");
  await page.getByRole("button", { name: /Nhập cách đọc/ }).click();
  await page.getByLabel("Cách đọc của từ").fill("まちがい");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.locator(".answer-feedback")).toContainText("Chưa đúng");
  await page.goto("/settings");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Xuất dữ liệu" }).click();
  const download = await downloading;
  const file = await download.path();
  await page
    .getByRole("button", { name: "Xóa dữ liệu học", exact: true })
    .click();
  await page.getByLabel("Nhập XÓA để xác nhận lần hai").fill("XÓA");
  await page.getByRole("button", { name: "Xác nhận xóa", exact: true }).click();
  await expect(page.locator(".notice")).toContainText("Đã xóa dữ liệu");
  await page.getByLabel("Chọn bản sao lưu JSON").setInputFiles(file!);
  await expect(page.locator(".import-preview")).toContainText(
    "1 bản ghi tiến độ",
  );
  await page.getByRole("button", { name: "Xác nhận thay thế" }).click();
  await expect(page.locator(".notice")).toContainText("Đã khôi phục");
  await page.goto("/review");
  await expect(
    page.getByRole("heading", { name: /mục đang chờ bạn/ }),
  ).toBeVisible();
  await page.goto("/settings");
  await page
    .getByLabel("Chọn bản sao lưu JSON")
    .setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"schemaVersion":999}'),
    });
  await expect(page.locator(".notice")).toContainText("File không hợp lệ");
});
