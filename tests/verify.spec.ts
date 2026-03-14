import { test, expect } from '@playwright/test';

test('Verify that the React app loads and displays the main dashboard shell with navigation.', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the app to finish loading the initial mock state
  await expect(page.locator('text=CutSync')).toBeVisible();

  // Verify that the navigation shell is present
  const sidebar = page.locator('nav').first();
  await expect(sidebar).toBeVisible();
  
  // Check for the presence of standard navigation items
  await expect(page.locator('button:has-text("Projects")').first()).toBeVisible();
  await expect(page.locator('button:has-text("Recent Assets")').first()).toBeVisible();
  await expect(page.locator('button:has-text("Settings")').first()).toBeVisible();

  // Wait for the ChronologicalRiver component container to appear
  await expect(page.locator('h3:has-text("Mock Project Alpha")').first()).toBeVisible();
  
  // Take screenshot at the end
  await page.screenshot({ path: 'evidence_old.png' });
});
