#!/bin/bash
sed -i 's/evidence_old.png/evidence_old.png.old/g' tests/verify.spec.ts
sed -i "s/'evidence.png'/'evidence_old.png'/g" tests/verify.spec.ts
