const fs = require('fs');
let content = fs.readFileSync('src/components/review/CanvasHUD.tsx', 'utf8');

// Ensure CanvasHUD explicitly gets pointer-events-auto
content = content.replace(
  'className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] flex gap-4"',
  'className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] flex gap-4 pointer-events-auto"'
);

fs.writeFileSync('src/components/review/CanvasHUD.tsx', content);
