const fs = require('fs');
let content = fs.readFileSync('tests/verify.spec.ts', 'utf8');

// The backtick was escaped as \` but it should be just ` since we used cat << 'EOF' correctly but then JS parser complains?
// Wait, the backtick wasn't escaped in the file, it was literal \` because I used cat << 'EOF' without expanding variables, but I wrote \` in the command!
// Let me fix the backticks.

content = content.replace(/\\\`/g, '`');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\\\n/g, '\\n');

fs.writeFileSync('tests/verify.spec.ts', content);
