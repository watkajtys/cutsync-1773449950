const fs = require('fs');
let content = fs.readFileSync('src/components/review/TheaterPlayer.tsx', 'utf8');

// The wrapper `<div className="pointer-events-auto w-full h-full relative">` is wrong, because
// if it has pointer-events-auto w-full h-full, it will capture ALL clicks over the video.
// We only want pointer-events-auto on the CanvasHUD component itself.
content = content.replace(
  '<div className="pointer-events-auto w-full h-full relative">\\n              <CanvasHUD />\\n            </div>',
  '<CanvasHUD />'
);

content = content.replace(
  '<div className={`transition-opacity duration-300 absolute inset-0 pointer-events-none z-50 ${error === \\\'ASSET_NOT_FOUND\\\' ? \\\'opacity-50 grayscale\\\' : \\\'\\\'}`}>\\n            <div className="pointer-events-auto w-full h-full relative">\\n              <CanvasHUD />\\n            </div>\\n          </div>',
  '<div className={`transition-opacity duration-300 absolute inset-0 pointer-events-none z-50 ${error === \\\'ASSET_NOT_FOUND\\\' ? \\\'opacity-50 grayscale\\\' : \\\'\\\'}`}>\\n            <CanvasHUD />\\n          </div>'
);

fs.writeFileSync('src/components/review/TheaterPlayer.tsx', content);
