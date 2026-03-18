const fs = require('fs');
let content = fs.readFileSync('src/components/review/TheaterPlayer.tsx', 'utf8');

content = content.replace(
  '<div className="pointer-events-auto w-full h-full relative">\n              <CanvasHUD />\n            </div>',
  '<CanvasHUD />'
);

fs.writeFileSync('src/components/review/TheaterPlayer.tsx', content);
