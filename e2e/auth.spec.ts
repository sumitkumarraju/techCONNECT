import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should register a new user and redirect to dashboard', async ({ page }) => {
        // Generate unique user data
        const uniqueId = Date.now();
        const username = `user_${uniqueId}`;
        const email = `user_${uniqueId}@example.com`;

        await page.goto('/register');

        // Fill registration form
        await page.fill('input[placeholder="Full Name"]', 'Test User');
        await page.fill('input[placeholder="Username"]', username);
        await page.fill('input[placeholder="Email Address"]', email);
        await page.fill('input[placeholder="Password"]', 'password123');

        // Click Sign Up
        await page.click('button:has-text("Sign Up Free")');

        // Wait for navigation to dashboard
        await expect(page).toHaveURL(/\/dashboard/);

        // Optional: Verify dashboard content (e.g., check for "Create Project" button or header)
        // await expect(page.locator('h1')).toContainText('Dashboard');
    });

    test('should show error for existing user', async ({ page }) => {
        // Register first user
        const uniqueId = Date.now();
        const username = `duplicate_${uniqueId}`;
        const email = `duplicate_${uniqueId}@example.com`;

        await page.goto('/register');
        await page.fill('input[placeholder="Full Name"]', 'Test User');
        await page.fill('input[placeholder="Username"]', username);
        await page.fill('input[placeholder="Email Address"]', email);
        await page.fill('input[placeholder="Password"]', 'password123');
        await page.click('button:has-text("Sign Up Free")');
        await expect(page).toHaveURL(/\/dashboard/);

        // Try to register again with same email
        await page.goto('/register');
        await page.fill('input[placeholder="Full Name"]', 'Test User');
        await page.fill('input[placeholder="Username"]', `new_${uniqueId}`); // Different username
        await page.fill('input[placeholder="Email Address"]', email); // Same email
        await page.fill('input[placeholder="Password"]', 'password123');
        await page.click('button:has-text("Sign Up Free")');

        // Expect error message
        await expect(page.locator('.text-jules-error')).toBeVisible();
        // You might want to check the specific error text if you know it
    });
});
