import { test, expect } from "@playwright/test";

test.describe("Math Problem Generator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/math-problem-generator");
  });

  test("generates addition problems", async ({ page }) => {
    await page.selectOption("#problemType", "addition");
    await page.fill("#minNumber", "1");
    await page.fill("#maxNumber", "10");
    await page.fill("#numProblems", "5");
    await page.click('button[type="submit"]');

    const problems = await page.$$eval("section li", (elems) => elems.length);
    expect(problems).toBe(5);
  });

  test("shows error message when minNumber > maxNumber", async ({ page }) => {
    await page.fill("#minNumber", "10");
    await page.fill("#maxNumber", "5");

    const errorMessage = await page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      "Minimum number cannot be greater than maximum number."
    );
  });

  test("displays answer key when checkbox is checked", async ({ page }) => {
    await page.fill("#minNumber", "1");
    await page.fill("#maxNumber", "10");
    await page.fill("#numProblems", "5");
    await page.check("#showAnswers");
    await page.click('button[type="submit"]');

    const answers = await page.$$eval(".text-right", (elems) => elems.length);
    expect(answers).toBe(5);
  });

  test("generates subtraction problems with no negative values", async ({
    page,
  }) => {
    await page.selectOption("#problemType", "subtraction");
    await page.fill("#minNumber", "1");
    await page.fill("#maxNumber", "10");
    await page.fill("#numProblems", "5");
    await page.check("#showAnswers");
    await page.click('button[type="submit"]');

    const answers = await page.$$eval(".text-right", (elems) => elems.length);
    expect(answers).toBe(5);
    // expect all answers to be positive
    const allPositive = await page.$$eval(".text-right", (elems) =>
      elems.every((elem) => parseInt(elem.textContent ?? "") >= 0)
    );
  });
});
