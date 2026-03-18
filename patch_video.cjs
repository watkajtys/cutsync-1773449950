const fs = require('fs');
let content = fs.readFileSync('src/components/review/TheaterPlayer.tsx', 'utf8');

content = content.replace(
  '<video \n            ref={videoRef}\n            style={{ pointerEvents: "none" }}',
  '<video \n            ref={videoRef}'
);

fs.writeFileSync('src/components/review/TheaterPlayer.tsx', content);
