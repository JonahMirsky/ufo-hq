import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

export type MediaKind = "image" | "video";
export type MediaAgency = "DoW" | "FBI" | "NASA" | "DoS" | "CIA" | "Other";

export interface MediaItem {
  id: string;
  title: string;
  kind: MediaKind;
  agency: MediaAgency;
  incident_date: string | null;
  year: number | null;
  date_approx: boolean;
  location: string;
  description: string;
  // image-only
  src?: string;
  src_local?: boolean;
  thumbnail?: string;
  source_url?: string;
  // video-only
  dvids_id?: string;
  video_title?: string;
  dvids_url?: string;
}

export async function loadMedia(): Promise<MediaItem[]> {
  const file = path.join(process.cwd(), "public", "data", "media.json");
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as MediaItem[];
}
