import fs from 'fs';
const content = fs.readFileSync('tests/verify.spec.ts', 'utf8');
console.log(content);
