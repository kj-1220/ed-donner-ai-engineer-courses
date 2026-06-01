import { expect, test } from "@playwright/test";

test("core Kanban flow: rename, add, move, delete", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('[data-testid^="column-col-"]')).toHaveCount(5);

  const firstColumnName = page.getByTestId("column-name-col-1");
  await firstColumnName.fill("Ideas");
  await expect(firstColumnName).toHaveValue("Ideas");

  await page.getByTestId("add-card-col-1").dispatchEvent("click");
  await expect(page.getByTestId("card-title-col-1")).toBeVisible();
  await page.getByTestId("card-title-col-1").fill("Launch pilot cohort");
  await page.getByTestId("card-details-col-1").fill("Invite first ten customers and collect feedback.");
  await page.getByTestId("save-card-col-1").click();

  const newCard = page.locator("article", { hasText: "Launch pilot cohort" });
  await expect(newCard).toBeVisible();

  const source = newCard.first();
  const target = page.getByTestId("column-col-2");
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not compute drag coordinates.");
  }

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 20 });
  await page.mouse.up();

  const cardInReadyColumn = page
    .getByTestId("column-col-2")
    .locator("article", { hasText: "Launch pilot cohort" });
  await expect(cardInReadyColumn).toBeVisible();

  await cardInReadyColumn.getByRole("button", { name: "Delete Launch pilot cohort" }).click();
  await expect(page.getByText("Launch pilot cohort")).toHaveCount(0);
});
