import { test, expect } from "@playwright/test";

// NOTE: These tests require:
// 1. Database with seed data (admin@example.com / password123)
// 2. Development server running (npm run dev)

test.describe("Login Flow", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should login successfully with correct credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should show error with incorrect password", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.getByText(/メールアドレスまたはパスワードが正しくありません/i)).toBeVisible();
  });

  test("should show validation error for empty fields", async ({ page }) => {
    await page.goto("/login");

    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.getByText(/必須/i)).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "invalid-email");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should show email validation error
    await expect(page.getByText(/有効なメールアドレス/i)).toBeVisible();
  });
});
