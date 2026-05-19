import { Timestamp } from "firebase/firestore";

// ─── CV Review Result (from Gemini AI) ───────────────────────────────

export interface CVReviewResult {
  score: number;
  atsFriendliness: {
    score: number;
    feedback: string;
    issues?: string[];
  };
  impactAndMetrics: {
    score: number;
    feedback: string;
    improvements?: string[];
  };
  structureAndReadability: {
    score: number;
    feedback: string;
    improvements?: string[];
  };
  overallSummary: string;
}

// ─── Firestore: User Profile ─────────────────────────────────────────

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  analysisCount: number;
}

// ─── Firestore: Analysis Document ────────────────────────────────────

export interface AnalysisDocument {
  filename: string;
  createdAt: Timestamp;
  score: number;
  atsFriendliness: {
    score: number;
    feedback: string;
    issues: string[];
  };
  impactAndMetrics: {
    score: number;
    feedback: string;
    improvements: string[];
  };
  structureAndReadability: {
    score: number;
    feedback: string;
    improvements: string[];
  };
  overallSummary: string;
}

// ─── Firestore: Rate Limit ───────────────────────────────────────────

export interface RateLimitDoc {
  count: number;
  date: string; // "YYYY-MM-DD" format — resets daily
  type: "anonymous" | "authenticated";
}

// ─── Legacy / Client-side (for backward compat during transition) ────

export interface RecentAnalysis {
  id: string; // Firestore document ID
  filename: string;
  timestamp: number;
  result: CVReviewResult;
}
