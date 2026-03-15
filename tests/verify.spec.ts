import { test, expect } from '@playwright/test';

test('Verify that the React app loads and displays the main dashboard shell with navigation.', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the app to finish loading the initial mock state
  await expect(page.locator('text=CutSync')).toBeVisible();

  // Verify that the navigation shell is present
  const sidebar = page.locator('nav').first();
  await expect(sidebar).toBeVisible();
  
  // Check for the presence of standard navigation items
  await expect(page.locator('a:has-text("Projects")').first()).toBeVisible();
  await expect(page.locator('a:has-text("Recent Assets")').first()).toBeVisible();
  await expect(page.locator('a:has-text("Settings")').first()).toBeVisible();

  // Intercept the POST request to PocketBase
  let projectCreated = false;
  let assetCreated = false;
  let assetType = '';
  let processingStatus = '';

  await page.route('**/api/collections/assets/records*', async (route, request) => {
    if (request.method() === 'POST') {
      assetCreated = true;
      const postData = request.postData();
      if (postData) {
        // Simple string check since it's multipart/form-data
        if (postData.includes('name="asset_type"') && postData.includes('source_clip')) {
          assetType = 'source_clip';
        }
        if (postData.includes('name="processing_status"') && postData.includes('pending')) {
          processingStatus = 'pending';
        }
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'ast1234567890xx',
          project_id: 'pbc1234567890xx',
          file: 'test_video.mp4',
          asset_type: 'source_clip',
          processing_status: 'pending',
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

  // Need to intercept the initial GET request to PocketBase as well
  // so the mock data loads correctly during the test
  await page.route('**/api/collections/projects/records*', async (route, request) => {
    if (request.method() === 'POST') {
      projectCreated = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'pbc1234567890xx',
          title: 'Integration Test Project',
          description: 'A project created via test',
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        })
      });
    } else if (request.method() === 'GET') {
      // If we've already created the project, return it in the list
      const items = projectCreated ? [
        { id: '1', title: 'Mock Project Alpha', description: 'A test project.' },
        { id: 'pbc1234567890xx', title: 'Integration Test Project', description: 'A project created via test' }
      ] : [
        { id: '1', title: 'Mock Project Alpha', description: 'A test project.' }
      ];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: items.length,
          totalPages: 1,
          items: items
        })
      });
    } else {
      await route.continue();
    }
  });

  // Open the New Project Modal
  await page.click('button:has-text("New Project")');
  await expect(page.locator('h2:has-text("New Project")').first()).toBeVisible();

  // Verify Asset Uploader is present
  await expect(page.locator('text=Drag & drop source video')).toBeVisible();

  // Fill in project details
  await page.fill('input#title', 'Integration Test Project');
  await page.fill('textarea#description', 'A project created via test');

  // Select 'source_clip' in the asset_type dropdown
  await page.selectOption('select#asset_type', 'source_clip');

  // Mock file upload
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('text=Drag & drop source video');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name: 'test_video.mp4',
    mimeType: 'video/mp4',
    buffer: Buffer.from('fake video content')
  });

  // Wait for file to be selected and shown
  await expect(page.locator('text=test_video.mp4')).toBeVisible();

  // Submit the form
  await page.click('button:has-text("Create Project")');
  
  // Wait for modal to disappear
  await expect(page.locator('h2:has-text("New Project")')).toBeHidden();

  // Verify the POST request was made
  expect(projectCreated).toBe(true);
  expect(assetCreated).toBe(true);
  expect(assetType).toBe('source_clip');
  expect(processingStatus).toBe('pending');
  
  // Wait for the ChronologicalRiver component container to show the new project
  await expect(page.locator('h3:has-text("Integration Test Project")').first()).toBeVisible();

  // Take screenshot at the end
  await page.screenshot({ path: 'evidence_old.png' });
});
