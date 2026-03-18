const fs = require('fs');
const content = fs.readFileSync('src/components/review/TheaterPlayer.tsx', 'utf8');

let newContent = content.replace(
  '<video \n            ref={videoRef}',
  '<video \n            ref={videoRef}\n            style={{ pointerEvents: "none" }}'
);

newContent = newContent.replace(
  '<div className={`transition-opacity duration-300 ${error === \'ASSET_NOT_FOUND\' ? \'opacity-50 grayscale pointer-events-none\' : \'\'}`}>\n            <CanvasHUD />\n          </div>',
  '<div className={`transition-opacity duration-300 absolute inset-0 pointer-events-none z-50 ${error === \'ASSET_NOT_FOUND\' ? \'opacity-50 grayscale\' : \'\'}`}>\n            <div className="pointer-events-auto w-full h-full relative">\n              <CanvasHUD />\n            </div>\n          </div>'
);

// We need to check if id === ':id' is implemented via useParams
const useReviewCheck = `
  const { id } = useParams<{ id: string }>();
`;

// wait, useParams is not imported in TheaterPlayer. Let's fix ReviewContext instead for the :id guard
fs.writeFileSync('src/components/review/TheaterPlayer.tsx', newContent);
