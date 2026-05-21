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

// ─── Recent Analysis (for localStorage history) ──────────────────────

export interface RecentAnalysis {
  id: string;
  filename: string;
  timestamp: number;
  result: CVReviewResult;
}
