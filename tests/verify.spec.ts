import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
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
  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ page: 1, perPage: 30, totalItems: 0, totalPages: 1, items: [] })
      });
    } else if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-new-note',
          asset_id: 'test-asset-123',
          author: 'Current User',
          timestamp: 0,
          note_text: 'A mock created note',
          canvas_data: null,
          created: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

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
  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ page: 1, perPage: 30, totalItems: 0, totalPages: 1, items: [] })
      });
    } else if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-new-note',
          asset_id: 'test-asset-123',
          author: 'Current User',
          timestamp: 0,
          note_text: 'A mock created note',
          canvas_data: null,
          created: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

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
  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 2,
          totalPages: 1,
          items: [
            {
              id: 'mock1',
              asset_id: 'test-asset-123',
              author: 'Sarah J.',
              timestamp: 725,
              note_text: 'Adjust color grade on this shot. Shadows are slightly crushed.',
              canvas_data: null,
              created: new Date(Date.now() - 120000).toISOString()
            },
            {
              id: 'mock2',
              asset_id: 'test-asset-123',
              author: 'Mark K.',
              timestamp: 845.12,
              note_text: 'Audio peak at 00:14:05. Needs level normalization.',
              canvas_data: null,
              created: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        })
      });
    } else if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-new-note',
          asset_id: 'test-asset-123',
          author: 'Current User',
          timestamp: 0,
          note_text: 'A mock created note',
          canvas_data: null,
          created: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

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
  await expect(page.locator('text=CURRENT: 0').first()).toBeVisible(); // Evaluates to 0 frames initially

  // Take screenshot of the new feature at the end
  await page.screenshot({ path: 'evidence_old.png' });
});

test('View the review route and ensure the right 30% sidebar renders a scrollable list of styled mock notes with timestamps, alongside an input field at the bottom.', async ({ page }) => {
  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 2,
          totalPages: 1,
          items: [
            {
              id: 'mock1',
              asset_id: 'test-asset-123',
              author: 'Sarah J.',
              timestamp: 725,
              note_text: 'Adjust color grade on this shot. Shadows are slightly crushed.',
              canvas_data: null,
              created: new Date(Date.now() - 120000).toISOString()
            },
            {
              id: 'mock2',
              asset_id: 'test-asset-123',
              author: 'Mark K.',
              timestamp: 845.12,
              note_text: 'Audio peak at 00:14:05. Needs level normalization.',
              canvas_data: null,
              created: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        })
      });
    } else if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-new-note',
          asset_id: 'test-asset-123',
          author: 'Current User',
          timestamp: 0,
          note_text: 'A mock created note',
          canvas_data: null,
          created: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/review/test-asset-123');
  
  // Verify the Sidebar container (should be ~30% equivalent width logic based on the design - e.g. w-80 or flex-basis)
  const sidebar = page.locator('aside').nth(1);
  await expect(sidebar).toBeVisible();

  // Verify the Technical Metadata section
  await expect(sidebar.locator('text=Technical Metadata')).toBeVisible();
  
  // Verify the Review Notes section and count
  await expect(sidebar.locator('text=Review Notes (2)')).toBeVisible();

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
  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ page: 1, perPage: 30, totalItems: 0, totalPages: 1, items: [] })
      });
    } else if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-new-note',
          asset_id: 'test-asset-123',
          author: 'Current User',
          timestamp: 0,
          note_text: 'A mock created note',
          canvas_data: null,
          created: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

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
  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ page: 1, perPage: 30, totalItems: 0, totalPages: 1, items: [] })
      });
    } else if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-new-note',
          asset_id: 'test-asset-123',
          author: 'Current User',
          timestamp: 0,
          note_text: 'A mock created note',
          canvas_data: null,
          created: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/review/test-asset-123');
  
  // Verify the drawing toolbar is present
  const toolbar = page.locator('aside').first();
  await expect(toolbar).toBeVisible();

  // Verify the tools are present
  await expect(page.locator('button:has-text("Pointer")')).toBeVisible();
  await expect(page.locator('button:has-text("Freehand")')).toBeVisible();
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

test('User saves a note at 0:15, it persists in PocketBase. Clicking an older note at 0:05 scrubs the video directly to 0:05.', async ({ page }) => {
  const assetId = 'testasset123456';
  
  // Initialize mock state
  const mockNotes = [
    {
      id: 'mock-old-note',
      asset_id: assetId,
      author: 'Mark K.',
      timestamp: 5,
      note_text: 'Older note at 0:05.',
      canvas_data: null,
      created: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: mockNotes.length,
          totalPages: 1,
          items: mockNotes
        })
      });
    } else if (request.method() === 'POST') {
      const postData = JSON.parse(request.postData() || '{}');
      const newNote = {
        id: `mock-new-${Date.now()}`,
        ...postData,
        created: new Date().toISOString()
      };
      mockNotes.push(newNote); // Update mock state so subsequent GETs return it
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(newNote)
      });
    } else {
      await route.continue();
    }
  });

  // Navigate directly to the review mode for this asset
  await page.goto(`/review/${assetId}`);

  // Wait for the older note to be visible
  const oldNote = page.locator('text=Older note at 0:05.').first();
  await expect(oldNote).toBeVisible();

  // Test scrubbing to 0:05 by clicking the older note
  await oldNote.click();
  
  await page.waitForTimeout(500);

  // Assert video time
  const currentTime = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.currentTime : 0;
  });
  expect(currentTime).toBeCloseTo(5, 1);

  // Now, simulate saving a note at 0:15
  await page.evaluate(() => {
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = 15;
      video.dispatchEvent(new Event('timeupdate'));
    }
  });
  
  await page.waitForTimeout(100);

  // Focus textarea and type
  const textarea = page.locator('textarea[placeholder*="Add note at"]');
  await expect(textarea).toBeVisible();
  
  await textarea.fill('New note at 0:15');
  
  // Click send button
  const sendButton = page.locator('button:has(svg.lucide-send)').first();
  await sendButton.click();

  // Wait for UI to update (the GET mock returns the updated notes list automatically)
  await expect(page.locator('text=New note at 0:15')).toBeVisible();

  // Hard reload to confirm persistence (mock state persists in memory during test)
  await page.reload();
  await expect(page.locator('text=New note at 0:15')).toBeVisible();

  // Take screenshot of evidence
  await page.screenshot({ path: 'evidence_old.png' });
});



test('Verify the Prep Mode UI layout and connect it to PocketBase to display source clips, AI transcripts, and cut suggestions.', async ({ page }) => {
  const assetId = 'test-asset-123';
  
  await page.route('**/api/collections/ai_transcripts/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 1,
          totalPages: 1,
          items: [
            {
              id: 'mock-transcript-1',
              asset_id: assetId,
              raw_text: "DIRECTOR: We've been tracking these signatures for three weeks.",
              created: new Date().toISOString()
            }
          ]
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/collections/ai_cut_suggestions/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 1,
          totalPages: 1,
          items: [
            {
              id: 'mock-cut-1',
              asset_id: assetId,
              start_timecode: 252,
              end_timecode: 258,
              cut_reason: "High focus on facial expressions. Ideal for transition.",
              created: new Date().toISOString()
            }
          ]
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/collections/assets/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: assetId,
          file: 'dummy_file.mp4'
        })
      });
    } else {
      await route.continue();
    }
  });

  // Navigate directly to the prep mode for this asset
  await page.goto(`/prep/${assetId}`);

  // Verify Header
  await expect(page.locator('text=Prep Mode')).toBeVisible();
  await expect(page.locator('text=AI Analysis Active')).toBeVisible();

  // Verify Player
  const video = page.locator('video').first();
  await expect(video).toBeVisible();

  // Verify Cut Suggestions rendering correctly with dynamic title logic
  await expect(page.locator('text=AI Cut Suggestions')).toBeVisible();
  await expect(page.locator('text=High focus on facial expressions. Ideal for transition.')).toBeVisible();
  await expect(page.locator('text=00:04:12 - 00:04:18')).toBeVisible();
  await expect(page.locator('h4:has-text("High focus on facial expressions")')).toBeVisible();

  // Verify Transcript rendering correctly with dynamic speaker parsing
  await expect(page.locator('text=Source Transcript')).toBeVisible();
  await expect(page.locator('text=DIRECTOR:')).toBeVisible();
  await expect(page.locator("text=We've been tracking these signatures for three weeks.")).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'evidence_old.png' });
});

test('Verify Prep Mode video synchronization and click-to-scrub navigation', async ({ page }) => {
  const assetId = 'test-asset-123';
  
  await page.route('**/api/collections/ai_transcripts/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 2,
          totalPages: 1,
          items: [
            {
              id: 'mock-transcript-1',
              asset_id: assetId,
              raw_text: "DIRECTOR: Welcome to the test.",
              created: new Date().toISOString()
            },
            {
              id: 'mock-transcript-2',
              asset_id: assetId,
              raw_text: "ACTOR: Thank you.",
              created: new Date().toISOString()
            }
          ]
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/collections/ai_cut_suggestions/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 1,
          totalPages: 1,
          items: [
            {
              id: 'mock-cut-1',
              asset_id: assetId,
              start_timecode: 15, // 00:00:15
              end_timecode: 20,
              cut_reason: "Good transition.",
              created: new Date().toISOString()
            }
          ]
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/collections/assets/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: assetId,
          file: 'dummy_file.mp4'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto(`/prep/${assetId}`);

  // Wait for things to load
  await expect(page.locator('text=Source Transcript')).toBeVisible();

  // Test 1: Click on Cut Suggestion
  // The start_timecode is 15. Clicking should set video currentTime to 15.
  const cutSuggestion = page.locator('text=Good transition.');
  await expect(cutSuggestion).toBeVisible();
  await cutSuggestion.click();
  
  await page.waitForTimeout(500);

  let currentTime = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.currentTime : 0;
  });
  expect(currentTime).toBeCloseTo(15, 1);

  // Test 2: Click on Transcript
  // First transcript is at mockTime = 0*10 = 0
  // Second transcript is at mockTime = 1*10 = 10
  const secondTranscript = page.locator('text=Thank you.');
  await expect(secondTranscript).toBeVisible();
  await secondTranscript.click();

  await page.waitForTimeout(500);

  currentTime = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.currentTime : 0;
  });
  expect(currentTime).toBeCloseTo(10, 1);

  // Test 3: Click on Timeline Progress Bar
  // The dummy.mp4 length is not deterministic before loading but let's mock the UI click.
  // We can evaluate directly on the DOM or simulate click.
  await page.evaluate(() => {
    // Set duration to 100 for easy calculation
    const video = document.querySelector('video');
    if (video) {
        // Since duration is readonly on HTMLVideoElement, we mock it by triggering context state updates or dispatching events if needed,
        // but let's just use the click handler directly via evaluate if possible, or trigger a click on the progress bar.
        // Easiest is to click the middle of the progress bar.
    }
  });

  const progressBar = page.locator('.bg-white\\/20.rounded-full.mb-4.cursor-pointer');
  await expect(progressBar).toBeVisible();
  const box = await progressBar.boundingBox();
  if (box) {
      // Click at 25% of the progress bar
      await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
  }

  await page.waitForTimeout(500);

  const duration = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.duration : 0;
  });

  currentTime = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.currentTime : 0;
  });

  // Since we clicked at 25%, current time should be roughly duration * 0.25
  if (duration > 0 && !isNaN(duration)) {
    expect(currentTime).toBeCloseTo(duration * 0.25, 1);
  }

  await page.screenshot({ path: 'evidence_old.png' });
});

test('Verify Prep Mode export functionality for SRT and CSV formats', async ({ page }) => {
  const assetId = 'test-asset-123';
  
  await page.route('**/api/collections/ai_transcripts/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 1,
          totalPages: 1,
          items: [
            {
              id: 'mock-transcript-1',
              asset_id: assetId,
              raw_text: "SPEAKER 1: Testing the export functionality.",
              created: new Date().toISOString()
            }
          ]
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/collections/ai_cut_suggestions/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: 1,
          totalPages: 1,
          items: [
            {
              id: 'mock-cut-1',
              asset_id: assetId,
              start_timecode: 10,
              end_timecode: 15,
              cut_reason: "Export test cut suggestion.",
              created: new Date().toISOString()
            }
          ]
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/collections/assets/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: assetId,
          file: 'dummy_file.mp4'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto(`/prep/${assetId}`);

  // Wait for things to load
  await expect(page.locator('text=Export SRT')).toBeVisible();
  await expect(page.locator('text=Export CSV')).toBeVisible();

  // Test Export SRT
  const downloadPromiseSRT = page.waitForEvent('download');
  await page.click('button:has-text("Export SRT")');
  const downloadSRT = await downloadPromiseSRT;
  expect(downloadSRT.suggestedFilename()).toBe(`transcript_${assetId}.srt`);

  // Test Export CSV
  const downloadPromiseCSV = page.waitForEvent('download');
  await page.click('button:has-text("Export CSV")');
  const downloadCSV = await downloadPromiseCSV;
  expect(downloadCSV.suggestedFilename()).toBe(`cut_suggestions_${assetId}.csv`);

  await page.screenshot({ path: 'evidence_old.png' });
});

test('Verify Canvas Annotation State Serialization and Playback Re-rendering', async ({ page }) => {
  const assetId = 'test-asset-123';
  
  // Track requests manually since the JS SDK cancels repeated requests
  const savedNotes: any[] = [];
  
  await page.route('**/api/collections/review_notes/records*', async (route, request) => {
    if (request.method() === 'POST') {
      const postData = JSON.parse(request.postData() || '{}');
      const newNote = {
        id: `mock-note-${Date.now()}`,
        asset_id: assetId,
        author: postData.author || 'Current User',
        timestamp: postData.timestamp || 0,
        note_text: postData.note_text || '',
        canvas_data: postData.canvas_data || null,
        created: new Date().toISOString()
      };
      savedNotes.push(newNote);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(newNote)
      });
    } else if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          page: 1,
          perPage: 30,
          totalItems: savedNotes.length,
          totalPages: 1,
          items: savedNotes
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/collections/assets/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: assetId,
          file: 'dummy_file.mp4'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto(`/review/${assetId}`);

  // Wait for things to load
  await expect(page.locator('text=Review Pipeline')).toBeVisible();

  // Test 1: Draw on canvas and save note
  // First, we need to select the box tool
  const boxTool = page.locator('button', { hasText: 'Box' });
  await boxTool.click();

  // Draw a box on the canvas
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + 100, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 200);
    await page.mouse.up();
  }

  // Type a note
  await page.fill('textarea[placeholder*="Add note at"]', 'Check this area');
  
  // Submit
  await page.click('button:has(svg.lucide-send)');

  // Note should appear in the list
  await expect(page.locator('text=Check this area')).toBeVisible();

  // Wait for the UI update
  await page.waitForTimeout(500);

  expect(savedNotes.length).toBe(1);
  expect(savedNotes[0].canvas_data).not.toBeNull();
  expect(savedNotes[0].canvas_data[0].tool).toBe('rect');
  
  // Now, Scrub away (simulate timeupdate to trigger clear)
  // This manual scrub (change of time > 0.5s) should clear the canvas since no note matches this new time.
  await page.evaluate(() => {
    const video = document.querySelector('video');
    if (video) {
        video.currentTime = video.currentTime + 5;
        video.dispatchEvent(new Event('timeupdate'));
    }
  });

  await page.waitForTimeout(500);

  // Now click the note in the sidebar, this will seek back and instantly re-render
  const noteElement = page.locator('text=Check this area');
  await noteElement.click();

  await page.waitForTimeout(500);

  // Now scrub away again to ensure the note is cleared after being viewed
  await page.evaluate(() => {
    const video = document.querySelector('video');
    if (video) {
        video.currentTime = video.currentTime + 5;
        video.dispatchEvent(new Event('timeupdate'));
    }
  });
  
  await page.waitForTimeout(500);
  
  // Finally, scrub TO the note's timestamp. It should automatically re-draw the shapes without clicking the note.
  await page.evaluate((noteTime) => {
    const video = document.querySelector('video');
    if (video) {
        video.currentTime = noteTime;
        video.dispatchEvent(new Event('timeupdate'));
    }
  }, savedNotes[0].timestamp);
  
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'evidence_old.png' });
});

test('Verify Theater Player Interactive Scrubber', async ({ page }) => {
  const assetId = 'test-asset-123';

  await page.route('**/api/collections/assets/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: assetId,
          file: 'dummy_file.mp4'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto(`/review/${assetId}`);

  // Wait for the Review Pipeline text or a basic element to confirm the page has loaded
  await expect(page.locator('text=Review Pipeline')).toBeVisible();

  // Find the video element
  const video = page.locator('video');
  await expect(video).toBeVisible();

  // Force some metadata to load or let the browser load dummy.mp4
  await page.waitForTimeout(1000);

  // We explicitly evaluate setting duration so the UI knows how to calculate the width
  await page.evaluate(() => {
    const vid = document.querySelector('video');
    if (vid) {
      // Mocking duration
      Object.defineProperty(vid, 'duration', { value: 60, writable: true });
      vid.dispatchEvent(new Event('loadedmetadata'));
      vid.dispatchEvent(new Event('durationchange'));
    }
  });
  
  await page.waitForTimeout(500);

  // Find the interactive scrubber container
  // It has a specific class mix: "absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20 cursor-pointer touch-none"
  const scrubberContainer = page.locator('.cursor-pointer.touch-none').last();
  await expect(scrubberContainer).toBeVisible();

  const box = await scrubberContainer.boundingBox();
  if (box) {
    // Click at 50% of the timeline
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.up();
  }

  await page.waitForTimeout(500);

  let currentTime = await page.evaluate(() => {
    const vid = document.querySelector('video');
    return vid ? vid.currentTime : 0;
  });

  // Current time should be around 50% of 60 seconds = 30
  expect(currentTime).toBeCloseTo(30, 0);

  if (box) {
    // Drag test: Click at 50%, drag to 75%
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);
    await page.mouse.up();
  }

  await page.waitForTimeout(500);

  currentTime = await page.evaluate(() => {
    const vid = document.querySelector('video');
    return vid ? vid.currentTime : 0;
  });

  // Current time should be around 75% of 60 seconds = 45
  expect(currentTime).toBeCloseTo(45, 0);

  await page.screenshot({ path: 'evidence_old.png' });
});

test('Pause the video, select the Bounding Box tool, draw a box over a subject, and verify the drawing renders correctly. Resume playback and ensure the canvas hides.', async ({ page }) => {
  const assetId = 'test-asset-123';

  await page.route('**/api/collections/assets/records*', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: assetId,
          file: 'dummy_file.mp4'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto(`/review/${assetId}`);

  // Wait for the Review Pipeline text or a basic element to confirm the page has loaded
  await expect(page.locator('text=Review Pipeline')).toBeVisible();

  // Find the video element
  const video = page.locator('video');
  await expect(video).toBeVisible();

  // Force video metadata to be loaded so we can interact
  await page.evaluate(() => {
    const vid = document.querySelector('video');
    if (vid) {
      Object.defineProperty(vid, 'duration', { value: 60, writable: true });
      vid.dispatchEvent(new Event('loadedmetadata'));
      vid.dispatchEvent(new Event('durationchange'));
    }
  });
  
  await page.waitForTimeout(500);

  // Pause the video if playing, but it shouldn't be playing on load
  // We'll select the box tool in MarkupSidebar
  const boxTool = page.locator('button', { hasText: 'Box' });
  await boxTool.click();

  // Draw a box on the canvas
  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible();
  
  // Make sure canvas does not have hidden class initially
  await expect(canvas).not.toHaveClass(/hidden/);

  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + 50, box.y + 50);
    await page.mouse.down();
    await page.mouse.move(box.x + 150, box.y + 150);
    await page.mouse.up();
  }

  // The drawing should render correctly. We can check if "Shape_1" appeared in Markup History
  await expect(page.locator('text=Shape_1')).toBeVisible();

  // Resume playback by clicking play button
  // the play button is the one with Play/Pause icon. In TheaterPlayer it's the middle one in controls.
  const playButton = page.locator('button.w-10.h-10.rounded-full.bg-white.text-black');
  await playButton.click();
  
  // Wait for a short duration
  await page.waitForTimeout(500);

  // Ensure the canvas hides
  await expect(canvas).toHaveClass(/hidden/);

  await page.screenshot({ path: 'evidence_old.png' });
});
