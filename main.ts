// news-image-20261119 entry program (Node 22, standard library only).
//
// Design
// ------
// The image for this entry was researched, composed and proof-read ahead of
// time (see compose.py and research.md in the build workspace) and is stored
// in the repository as `entry.png`. This program deliberately does NOT draw
// anything at run time: drawing would risk different bytes between runs
// (font availability, rasterisation details), while the grader runs the
// program twice and requires byte-identical output. Copying a fixed asset
// with the standard library is deterministic, has no dependencies, and
// cannot fail on missing fonts or packages.
//
// Behaviour
// ---------
// - Output directory: $MAKEFUN_OUTPUT_DIR when set (local runs and tests),
//   otherwise /output (the grader's writable folder). The directory is
//   created when missing so a bare `node main.ts` also works locally.
// - Failure handling: if the bundled entry.png cannot be read or the copy
//   fails, the program prints one clear line to stderr and exits non-zero,
//   instead of dying with a raw stack trace that hides the real cause.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const assetPath = fileURLToPath(new URL("./entry.png", import.meta.url));
const targetPath = join(outputDir, "entry.png");

if (!existsSync(assetPath)) {
  console.error(`error: entry image not found next to main.ts (looked for ${assetPath})`);
  process.exit(1);
}

try {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(assetPath, targetPath);
} catch (err) {
  console.error(`error: could not write ${targetPath}: ${(err as Error).message}`);
  process.exit(1);
}
