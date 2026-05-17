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
