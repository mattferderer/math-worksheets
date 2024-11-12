import { test, expect } from "@playwright/test";

test.describe("Multiplication Division Basic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/multiplication-division-basics");
  });

  test("should display error for invalid base number", async ({ page }) => {
    const baseNumberInput = page.locator(
      "[data-test-name='base-number-input']"
    );
    const errorMessage = page.locator("[data-test-name='error-message']");

    await baseNumberInput.fill("0");
    await expect(errorMessage).toBeVisible();

    await baseNumberInput.fill("100");
    await expect(errorMessage).toBeVisible();

    await baseNumberInput.fill("-100");
    await expect(errorMessage).toBeVisible();

    await baseNumberInput.fill("5");
    await expect(errorMessage).toBeHidden();
  });

  test("should toggle Skip Counting section", async ({ page }) => {
    const skipCountingCheckbox = page.locator(
      "[data-test-name='include-skip-counting-checkbox']"
    );
    const skipCountingSection = page.locator(
      "[data-test-name='skip-counting-section']"
    );

    // Initially visible
    await expect(skipCountingSection).toBeVisible();

    // Uncheck and verify
    await skipCountingCheckbox.uncheck();
    await expect(skipCountingSection).toBeHidden();

    // Check again and verify
    await skipCountingCheckbox.check();
    await expect(skipCountingSection).toBeVisible();
  });

  test("should toggle Multiplication Grid section", async ({ page }) => {
    const multiplicationCheckbox = page.locator(
      "[data-test-name='include-multiplication-grid-checkbox']"
    );
    const multiplicationSection = page.locator(
      "[data-test-name='multiplication-grid-section']"
    );

    // Initially visible
    await expect(multiplicationSection).toBeVisible();

    // Uncheck and verify
    await multiplicationCheckbox.uncheck();
    await expect(multiplicationSection).toBeHidden();

    // Check again and verify
    await multiplicationCheckbox.check();
    await expect(multiplicationSection).toBeVisible();
  });

  test("should display answers when 'Show Answer Key' is checked in multiplication grid", async ({
    page,
  }) => {
    const showAnswersCheckbox = page.locator(
      "[data-test-name='show-answers-checkbox']"
    );
    const answerCells = page.locator(
      "[data-test-name='multiplication-result-input']"
    );

    // Ensure answer inputs are shown
    await expect(answerCells).toHaveCount(11);

    // Check 'Show Answer Key' and verify answers are displayed and input hidden
    await showAnswersCheckbox.check();
    await expect(answerCells).toHaveCount(0);

    // Uncheck and verify answer inputs are shown & empty input is shown
    await showAnswersCheckbox.uncheck();
    await expect(answerCells).toHaveCount(11);
  });

  test("should randomize long multiplication order when enabled", async ({
    page,
  }) => {
    const randomizeCheckbox = page.locator(
      "[data-test-name='randomize-long-multiplication-checkbox']"
    );
    const longMultiplicationSection = page.locator(
      "[data-test-name='long-multiplication-section']"
    );
    const longMultiplicationItems = longMultiplicationSection.locator(
      "[data-test-name='long-multiplication-item']"
    );

    // Capture initial order
    const initialOrder = await longMultiplicationItems.allTextContents();

    // Enable randomization
    await randomizeCheckbox.check();

    const randomizedOrder = await longMultiplicationItems.allTextContents();

    // Verify the order has changed
    expect(randomizedOrder).not.toEqual(initialOrder);
  });

  test("should enable/disable 'Show Blocks Visualization' based on base number", async ({
    page,
  }) => {
    const baseNumberInput = page.locator(
      "[data-test-name='base-number-input']"
    );
    const showBlocksCheckbox = page.locator(
      "[data-test-name='show-blocks-checkbox']"
    );

    // Set base number outside valid range
    await baseNumberInput.fill("11");
    await expect(showBlocksCheckbox).toBeDisabled();

    // Set base number within valid range
    await baseNumberInput.fill("5");
    await expect(showBlocksCheckbox).toBeEnabled();
  });

  test("should display correct multiplication results in grid", async ({
    page,
  }) => {
    const baseNumberInput = page.locator(
      "[data-test-name='base-number-input']"
    );
    const showAnswersCheckbox = page.locator(
      "[data-test-name='show-answers-checkbox']"
    );

    await baseNumberInput.fill("5");
    await showAnswersCheckbox.check();

    const multiplicationResults = page.locator(
      "[data-test-name='multiplication-result-cell']"
    );

    for (let i = 0; i <= 10; i++) {
      const expectedValue = (i * 5).toString();
      await expect(multiplicationResults.nth(i)).toHaveText(expectedValue);
    }
  });

  test("should display correct division results", async ({ page }) => {
    const baseNumberInput = page.locator(
      "[data-test-name='base-number-input']"
    );
    const includeDivisionGridCheckbox = page.locator(
      "[data-test-name='include-division-grid-checkbox']"
    );
    const showAnswersCheckbox = page.locator(
      "[data-test-name='show-answers-checkbox']"
    );

    await baseNumberInput.fill("5");
    await includeDivisionGridCheckbox.check();
    await showAnswersCheckbox.check();

    const divisionGridSection = page.locator(
      "[data-test-name='division-grid-section']"
    );
    const divisionResults = divisionGridSection.locator(
      "[data-test-name='division-result-cell']"
    );

    for (let i = 0; i <= 10; i++) {
      const expectedValue = i.toString();
      await expect(divisionResults.nth(i)).toHaveText(expectedValue);
    }
  });

  test("should display blocks visualization when enabled", async ({ page }) => {
    const baseNumberInput = page.locator(
      "[data-test-name='base-number-input']"
    );
    const showBlocksCheckbox = page.locator(
      "[data-test-name='show-blocks-checkbox']"
    );
    const blocksSection = page.locator(
      "[data-test-name='multiplication-blocks-section']"
    );

    // Set valid base number and enable blocks visualization
    await baseNumberInput.fill("3");
    await showBlocksCheckbox.check();

    await expect(blocksSection).toBeVisible();

    // Verify that blocks are displayed
    await expect(
      blocksSection.locator("[data-test-name='multiplication-block']").nth(5)
    ).toBeVisible();
    await expect(
      blocksSection.locator("[data-test-name='multiplication-group']")
    ).toHaveCount(10);
  });

  test("should validate long multiplication answers", async ({ page }) => {
    const baseNumberInput = page.locator(
      "[data-test-name='base-number-input']"
    );
    const showAnswersCheckbox = page.locator(
      "[data-test-name='show-answers-checkbox']"
    );

    await baseNumberInput.fill("4");
    await showAnswersCheckbox.check();

    const longMultiplicationSection = page.locator(
      "[data-test-name='long-multiplication-section']"
    );
    const longMultiplicationItems = longMultiplicationSection.locator(
      "[data-test-name='long-multiplication-item']"
    );

    for (let i = 0; i <= 10; i++) {
      const item = longMultiplicationItems.nth(i);
      const expression = await item.innerText();
      const [multiplicand, multiplier] = expression.match(/\d+/g)!.map(Number);
      const expectedResult = (multiplicand * multiplier).toString();

      await expect(item).toContainText(expectedResult);
    }
  });

  test("should hide sections when their features are disabled", async ({
    page,
  }) => {
    const sections = [
      {
        checkbox: "[data-test-name='include-skip-counting-checkbox']",
        sectionLocator: "[data-test-name='skip-counting-section']",
      },
      {
        checkbox: "[data-test-name='include-multiplication-grid-checkbox']",
        sectionLocator: "[data-test-name='multiplication-grid-section']",
      },
      {
        checkbox: "[data-test-name='include-long-multiplication-checkbox']",
        sectionLocator: "[data-test-name='long-multiplication-section']",
      },
      {
        checkbox: "[data-test-name='include-division-grid-checkbox']",
        sectionLocator: "[data-test-name='division-grid-section']",
      },
      {
        checkbox: "[data-test-name='include-long-division-checkbox']",
        sectionLocator: "[data-test-name='long-division-section']",
      },
    ];

    for (const { checkbox, sectionLocator } of sections) {
      const featureCheckbox = page.locator(checkbox);
      const section = page.locator(sectionLocator);

      // Initially visible
      await expect(section).toBeVisible();

      // Disable feature
      await featureCheckbox.uncheck();
      await expect(section).toBeHidden();

      // Enable feature
      await featureCheckbox.check();
      await expect(section).toBeVisible();
    }
  });
});
