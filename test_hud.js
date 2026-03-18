const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // We can't really run it locally outside of the playwright test runner because the dev server isn't running
  await browser.close();
})();
