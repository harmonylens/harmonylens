import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("public/photos");
const OUT = path.resolve("src/data/photos.json");

function isImage(file) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
}

function readDirRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...readDirRecursive(full));
    else if (e.isFile() && isImage(e.name)) files.push(full);
  }
  return files;
}

if (!fs.existsSync(ROOT)) {
  console.error(`Folder not found: ${ROOT}`);
  process.exit(1);
}

const allFiles = readDirRecursive(ROOT);

// event = eerste folder onder /public/photos/<event>/...
const photos = allFiles
  .map((abs) => {
    const relFromPublic = abs.split(path.resolve("public"))[1].replaceAll("\\", "/"); // "/photos/.."
    const parts = relFromPublic.split("/").filter(Boolean); // ["photos","kinderfeest","001.jpg"]
    const event = parts[1] ?? "unknown";
    const filename = parts.at(-1);
    return {
      id: `${event}-${filename}`,
      event,
      src: relFromPublic, // werkt direct in browser
      featured: false,
    };
  })
  .sort((a, b) => (a.event + a.src).localeCompare(b.event + b.src));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ photos }, null, 2));
console.log(`✅ Wrote ${photos.length} photos -> ${OUT}`);
