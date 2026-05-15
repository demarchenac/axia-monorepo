import { UTApi } from "uploadthing/server";
import { parseArgs } from "node:util";
import { createWriteStream, unlinkSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { join } from "node:path";
import { tmpdir } from "node:os";

const { values } = parseArgs({
  options: {
    query: { type: "string", default: "dental clinic smile" },
    count: { type: "string", default: "1" },
  },
});

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const UT_TOKEN = process.env.UPLOADTHING_TOKEN;

if (!PEXELS_KEY) {
  console.error("Missing PEXELS_API_KEY in environment");
  process.exit(1);
}
if (!UT_TOKEN) {
  console.error("Missing UPLOADTHING_TOKEN in environment");
  process.exit(1);
}

const utapi = new UTApi({ token: UT_TOKEN });

type PexelsVideo = {
  id: number;
  url: string;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
};

type PexelsResponse = {
  videos: PexelsVideo[];
  total_results: number;
};

async function searchPexelsVideos(query: string, count: number): Promise<PexelsVideo[]> {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: PEXELS_KEY! },
  });
  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as PexelsResponse;
  console.log(`Found ${data.total_results} videos for "${query}", fetching ${Math.min(count, data.videos.length)}`);
  return data.videos.slice(0, count);
}

function pickBestFile(video: PexelsVideo) {
  const mp4s = video.video_files.filter((f) => f.file_type === "video/mp4");
  const hd = mp4s.find((f) => f.quality === "hd" && f.width >= 1280);
  const sd = mp4s.find((f) => f.quality === "sd" && f.width >= 640);
  return hd ?? sd ?? mp4s[0];
}

async function downloadToTemp(url: string, id: number): Promise<string> {
  const filePath = join(tmpdir(), `pexels-${id}.mp4`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body as any), createWriteStream(filePath));
  return filePath;
}

async function main() {
  const query = values.query!;
  const count = parseInt(values.count!, 10);

  console.log(`\nSearching Pexels for: "${query}" (count: ${count})\n`);

  const videos = await searchPexelsVideos(query, count);
  if (!videos.length) {
    console.log("No videos found.");
    return;
  }

  const results: string[] = [];

  for (const video of videos) {
    const file = pickBestFile(video);
    if (!file) {
      console.log(`  [${video.id}] No suitable MP4 found, skipping`);
      continue;
    }

    console.log(`  [${video.id}] Downloading ${file.quality} ${file.width}x${file.height}...`);
    const tmpPath = await downloadToTemp(file.link, video.id);

    console.log(`  [${video.id}] Uploading to UploadThing...`);
    const { readFileSync } = await import("node:fs");
    const buffer = readFileSync(tmpPath);
    const utFile = new File([buffer], `pexels-${video.id}.mp4`, { type: "video/mp4" });

    const uploaded = await utapi.uploadFiles([utFile]);
    const result = uploaded[0];

    if (result.error) {
      console.error(`  [${video.id}] Upload failed:`, result.error);
    } else {
      console.log(`  [${video.id}] ✓ ${result.data.ufsUrl}`);
      results.push(result.data.ufsUrl);
    }

    try { unlinkSync(tmpPath); } catch {}
  }

  if (results.length) {
    console.log(`\n--- Uploaded URLs ---`);
    results.forEach((url) => console.log(url));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
