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

test('Verify center play button overlay is removed', async ({ page }) => {
  await page.goto('/');

  // Wait for the app to load
  await expect(page.locator('text=CutSync')).toBeVisible();

  // Based on "TARGET ROUTE: /" and typical CutSync behavior, if there's a link to a review, we click it.
  // Wait, if it's on /, we just verify it directly. 
  // Let's make sure that `<Play size={48} />` or the large play button is not present.
  
  // Actually, we can just navigate to a known review route since the TheaterPlayer is there. 
  // The instruction said "navigate strictly to / and verify the absence of the center play button directly on that route."
  // Even if TheaterPlayer is not explicitly loaded on /, verifying it's absent on / satisfies the exact wording.
  // But wait, what if TheaterPlayer *is* part of / now? Let's verify no Play button of size 48 is present.
  
  // We'll just verify the overlay is absent.
  // The overlay has class: absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity
  // Or the button itself: <Play size={48} /> (which translates to svg width="48" height="48" in lucide-react typically).
  
  const largePlayButton = page.locator('svg[width="48"][height="48"]');
  await expect(largePlayButton).toHaveCount(0);

  // Take screenshot of the new feature at the end
  await page.screenshot({ path: 'evidence_old.png' });
});

test('User hits spacebar during playback; video pauses and new note input is focused.', async ({ page }) => {
  await page.goto('/review/test-asset-123');

  // Verify the video and input exist
  const video = page.locator('video').first();
  await expect(video).toBeVisible();
  
  const textarea = page.locator('textarea[placeholder*="Add note at"]');
  await expect(textarea).toBeVisible();

  // First, verify the video is paused initially
  let isPaused = await video.evaluate((node: HTMLVideoElement) => node.paused);
  expect(isPaused).toBe(true);

  // Focus out of any input to make sure spacebar works for the global listener
  await page.locator('body').focus();

  // Hit spacebar to play
  await page.keyboard.press('Space');
  
  // Wait a little for play to trigger
  await page.waitForTimeout(500);

  // Actually, some browsers restrict autoplay without interaction, but since it's a test environment with simulated press, it might work.
  // We can just verify that it is playing or toggled.
  // Wait, hitting spacebar triggers `togglePlay` logic we added: play() then pause().
  isPaused = await video.evaluate((node: HTMLVideoElement) => node.paused);
  expect(isPaused).toBe(false);

  // The input should also be focused according to our logic
  await expect(textarea).toBeFocused();

  // Focus out of the input again
  await textarea.evaluate((node: HTMLTextAreaElement) => node.blur());

  // Hit spacebar to pause
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);

  isPaused = await video.evaluate((node: HTMLVideoElement) => node.paused);
  expect(isPaused).toBe(true);

  // The input should be focused again
  await expect(textarea).toBeFocused();

  // Take screenshot of the evidence
  await page.screenshot({ path: 'evidence_old.png' });
});

test('Verify the Review Mode shell and layout for a specific asset', async ({ page }) => {
  // Navigate directly to the review mode for a mock asset
  await page.goto('/review/test-asset-123');
  
  // Verify that the header navigation is present
  await expect(page.locator('text=Active Workspace').first()).toBeVisible();
  await expect(page.locator('text=Review Pipeline').first()).toBeVisible();
  await expect(page.locator('text=Alex Rivers').first()).toBeVisible();

  // Verify the Theater Mode video player section
  await expect(page.locator('text=SCENE 04 | TAKE 02 | V03').first()).toBeVisible();
  await expect(page.locator('text=4K DCI (4096 x 1716)').first()).toBeVisible();

  // Verify the NotesSidebar section
  await expect(page.locator('h3:has-text("Technical Metadata")').first()).toBeVisible();
  await expect(page.locator('text=File Info').first()).toBeVisible();
  await expect(page.locator('text=Color Space').first()).toBeVisible();

  // Verify mock timestamped notes in the sidebar
  await expect(page.locator('text=Sarah J.').first()).toBeVisible();
  await expect(page.locator('text=Mark K.').first()).toBeVisible();
  
  // Verify the text area for adding a comment
  const textarea = page.locator('textarea[placeholder*="Add note at"]');
  await expect(textarea).toBeVisible();

  // Verify the Chronological River timeline section at the bottom
  await expect(page.locator('text=Chronological River • Frame-by-Frame Navigation').first()).toBeVisible();
  await expect(page.locator('text=CURRENT: 20187').first()).toBeVisible();

  // Take screenshot of the new feature at the end
  await page.screenshot({ path: 'evidence_old.png' });
});

test('View the review route and ensure the right 30% sidebar renders a scrollable list of styled mock notes with timestamps, alongside an input field at the bottom.', async ({ page }) => {
  await page.goto('/review/test-asset-123');
  
  // Verify the Sidebar container (should be ~30% equivalent width logic based on the design - e.g. w-80 or flex-basis)
  const sidebar = page.locator('aside').first();
  await expect(sidebar).toBeVisible();

  // Verify the Technical Metadata section
  await expect(sidebar.locator('text=Technical Metadata')).toBeVisible();
  
  // Verify the Review Notes section and count
  await expect(sidebar.locator('text=Review Notes (4)')).toBeVisible();

  // Verify the scrollable list container for notes
  const notesContainer = sidebar.locator('.overflow-y-auto.custom-scrollbar').nth(1);
  await expect(notesContainer).toBeVisible();

  // Verify a specific styled note with timestamp
  const firstNote = notesContainer.locator('text=Adjust color grade on this shot').first();
  await expect(firstNote).toBeVisible();
  await expect(notesContainer.locator('text=00:12:05:00').first()).toBeVisible();

  // Verify the input field at the bottom
  const inputField = sidebar.locator('textarea[placeholder*="Add note at"]');
  await expect(inputField).toBeVisible();
  const sendButton = sidebar.locator('button:has(svg.lucide-send)').first();
  await expect(sendButton).toBeVisible();

  await page.screenshot({ path: 'evidence_old.png' });
});

test('Verify the Review Mode uses proper lucide icons after refactoring', async ({ page }) => {
  await page.goto('/review/test-asset-123');
  
  // Verify lucide-react icons are loaded in the DOM (usually they have lucide class or are SVGs)
  // Check the Database icon in the header
  const databaseIcon = page.locator('header svg.lucide-database').first();
  await expect(databaseIcon).toBeVisible();

  // Check PlayCircle icon
  const playCircleIcon = page.locator('header svg').nth(1);
  await expect(playCircleIcon).toBeVisible();

  // Check CloudCog in footer
  const cloudCogIcon = page.locator('footer svg').first();
  await expect(cloudCogIcon).toBeVisible();

  await page.screenshot({ path: 'evidence_old.png' });
});

test('Verify the visual annotation tools render a drawing toolbar and overlay canvas in Review Mode', async ({ page }) => {
  await page.goto('/review/test-asset-123');
  
  // Verify the drawing toolbar is present
  const toolbar = page.locator('div').filter({ hasText: 'Ptr' }).first();
  await expect(toolbar).toBeVisible();

  // Verify the tools are present
  await expect(page.locator('button:has-text("Ptr")')).toBeVisible();
  await expect(page.locator('button:has-text("Pen")')).toBeVisible();
  await expect(page.locator('button:has-text("Box")')).toBeVisible();
  await expect(page.locator('button:has-text("Arr")')).toBeVisible();

  // Verify the canvas is present inside the video container
  const canvas = page.locator('.video-container canvas').first();
  await expect(canvas).toBeVisible();

  // Click the 'Box' tool to select it
  await page.click('button:has-text("Box")');

  // Verify the canvas cursor changes (class includes 'cursor-crosshair')
  await expect(canvas).toHaveClass(/cursor-crosshair/);

  // Take screenshot of the new feature at the end
  await page.screenshot({ path: 'evidence_old.png' });
});
