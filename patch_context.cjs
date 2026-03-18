const fs = require('fs');
let content = fs.readFileSync('src/contexts/ReviewContext.tsx', 'utf8');

// Ensure the :id check returns early from API
content = content.replace(
  "if (assetId === ':id') {",
  "if (assetId === ':id' || !assetId) {"
);

// We should also replace the second instance for loadAsset
content = content.replace(
  "if (assetId === ':id') {",
  "if (assetId === ':id' || !assetId) {"
);

fs.writeFileSync('src/contexts/ReviewContext.tsx', content);
