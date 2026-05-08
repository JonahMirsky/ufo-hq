import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metrics, Sighting, UfoDocument } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function readJson<T>(name: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, name), "utf-8");
  return JSON.parse(raw) as T;
}

let _docs: UfoDocument[] | null = null;
let _sightings: Sighting[] | null = null;
let _metrics: Metrics | null = null;

export async function loadDocuments(): Promise<UfoDocument[]> {
  if (!_docs) _docs = await readJson<UfoDocument[]>("documents.json");
  return _docs;
}

export async function loadSightings(): Promise<Sighting[]> {
  if (!_sightings) _sightings = await readJson<Sighting[]>("sightings.json");
  return _sightings;
}

export async function loadMetrics(): Promise<Metrics> {
  if (!_metrics) _metrics = await readJson<Metrics>("metrics.json");
  return _metrics;
}

export async function getDocument(id: string): Promise<UfoDocument | null> {
  const docs = await loadDocuments();
  return docs.find((d) => d.id === id) ?? null;
}

export async function getSightingsForDoc(id: string): Promise<Sighting[]> {
  const all = await loadSightings();
  return all.filter((s) => s.doc_id === id);
}
