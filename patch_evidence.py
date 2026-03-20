import re

with open('tests/verify.spec.ts', 'r') as f:
    content = f.read()

# Only add evidence.png to the last test which is the ErrorBoundary test
lines = content.split('\n')
for i, line in enumerate(reversed(lines)):
    if '});' in line:
        idx = len(lines) - 1 - i
        lines.insert(idx, "  await page.screenshot({ path: 'evidence.png' });")
        break

with open('tests/verify.spec.ts', 'w') as f:
    f.write('\n'.join(lines))
