import { gzipSync } from "node:zlib";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;

const limits = {
  totalJsGzipKb: 180,
  largestJsGzipKb: 150,
  totalCssGzipKb: 30,
  totalBuildGzipKb: 260,
};

async function walk(directory) {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await walk(DIST);
const measured = [];

for (const file of files) {
  const buffer = await readFile(file);
  measured.push({
    file: relative(DIST, file),
    bytes: buffer.length,
    gzipBytes: gzipSync(buffer).length,
  });
}

const js = measured.filter((item) => item.file.endsWith(".js"));
const css = measured.filter((item) => item.file.endsWith(".css"));
const kb = (bytes) => bytes / 1024;
const total = (items, key) =>
  items.reduce((sum, item) => sum + item[key], 0);

const metrics = {
  totalJsGzipKb: kb(total(js, "gzipBytes")),
  largestJsGzipKb: kb(
    Math.max(0, ...js.map((item) => item.gzipBytes))
  ),
  totalCssGzipKb: kb(total(css, "gzipBytes")),
  totalBuildGzipKb: kb(total(measured, "gzipBytes")),
};

for (const [metric, value] of Object.entries(metrics)) {
  const limit = limits[metric];
  const label = metric.replace(/([A-Z])/g, " $1").toLowerCase();
  console.log(
    label + ": " + value.toFixed(1) + " KB / " + limit + " KB"
  );

  if (value > limit) {
    throw new Error(
      label +
        " exceeds performance budget (" +
        value.toFixed(1) +
        " KB > " +
        limit +
        " KB)"
    );
  }
}
