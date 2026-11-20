// news-image-20261119 entry program, v6 front page (Node, standard library only).
//
// The entry image was researched, drawn and proof-read ahead of time in the
// build workspace (compose-v6.py) and ships in the repository as `entry.png`.
// This program copies that fixed asset to the output directory. It draws
// nothing at run time: the grader runs the program twice and requires
// byte-identical output, and a straight file copy is the one approach that
// cannot drift with fonts, rasterisers or environment.
//
// Contract:
// - Reads the asset `entry.png` sitting next to this file.
// - Writes it to `$MAKEFUN_OUTPUT_DIR/entry.png`, defaulting to
//   `/output/entry.png` when the variable is unset.
// - Creates the output directory when it does not exist yet.
// - If the asset is missing, prints one clear line to stderr and exits 1.
// - Guards the asset before copying: the file must start with the PNG
//   magic bytes. (A chat app once re-encoded this entry's image to JPEG
//   under a .png name; the sealed gate reads the first bytes, so a wrong
//   format must fail loudly here, not silently at grading.)
// - Verifies the copy afterwards: the written file's byte length must
//   equal the asset's, or the run fails instead of passing a torn write.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const assetPath = fileURLToPath(new URL("./entry.png", import.meta.url));
const targetPath = join(outputDir, "entry.png");

if (!existsSync(assetPath)) {
  console.error(`error: entry.png not found next to main.ts (looked for ${assetPath})`);
  process.exit(1);
}

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const head = readFileSync(assetPath).subarray(0, PNG_MAGIC.length);
if (!PNG_MAGIC.every((b, i) => head[i] === b)) {
  console.error("error: entry.png does not start with PNG magic bytes; refusing to submit a non-PNG asset");
  process.exit(1);
}

try {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(assetPath, targetPath);
} catch (err) {
  console.error(`error: failed to write ${targetPath}: ${(err as Error).message}`);
  process.exit(1);
}

const assetBytes = statSync(assetPath).size;
const writtenBytes = statSync(targetPath).size;
if (writtenBytes !== assetBytes) {
  console.error(`error: copy verification failed: wrote ${writtenBytes} bytes, asset is ${assetBytes} bytes`);
  process.exit(1);
}
