import { CVReviewResult } from "@/types";

// ─── Configuration ───────────────────────────────────────────────────

const STORAGE_KEY = "cvlint_analyses";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// ─── Types ───────────────────────────────────────────────────────────

export interface StoredAnalysis {
  id: string;
  filename: string;
  timestamp: number; // Date.now()
  result: CVReviewResult;
}

interface StoragePayload {
  analyses: StoredAnalysis[];
  expiresAt: number; // timestamp when the entire batch expires
}

// ─── Helpers ─────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readPayload(): StoragePayload | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const payload: StoragePayload = JSON.parse(raw);

    // Check if the entire storage has expired
    if (Date.now() > payload.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return payload;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writePayload(payload: StoragePayload): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// ─── Public API ──────────────────────────────────────────────────────

/** Save a new CV analysis result. Returns the generated ID. */
export function saveAnalysis(
  filename: string,
  result: CVReviewResult,
): string {
  const id = generateId();
  const now = Date.now();

  const existing = readPayload();
  const analyses = existing?.analyses ?? [];

  // Prepend new analysis (most recent first)
  analyses.unshift({
    id,
    filename,
    timestamp: now,
    result,
  });

  // Keep max 20 analyses to avoid bloating localStorage
  const trimmed = analyses.slice(0, 20);

  writePayload({
    analyses: trimmed,
    expiresAt: now + TTL_MS,
  });

  return id;
}

/** Get all stored analyses (most recent first). Returns empty array if expired. */
export function getAnalyses(): StoredAnalysis[] {
  const payload = readPayload();
  return payload?.analyses ?? [];
}

/** Get a single analysis by ID. Returns null if not found or expired. */
export function getAnalysisById(id: string): StoredAnalysis | null {
  const analyses = getAnalyses();
  return analyses.find((a) => a.id === id) ?? null;
}

/** Clear all stored analyses. */
export function clearAnalyses(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
