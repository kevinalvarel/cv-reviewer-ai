"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAnalysisById } from "@/lib/storage";
import ReviewResult from "@/components/ReviewResult";
import { CVReviewResult } from "@/types";
import { ArrowLeft, FileSearch, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  const [result, setResult] = useState<CVReviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const analysisId = params.id as string;

  useEffect(() => {
    // Look up the analysis from localStorage
    const analysis = getAnalysisById(analysisId);

    if (analysis) {
      setResult(analysis.result);
    } else {
      setError(
        "Hasil analisis nggak ketemu. Mungkin udah lewat 24 jam atau belum pernah dianalisis.",
      );
    }

    setLoading(false);
  }, [analysisId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Lagi ngambil data...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {error || "Hasil analisis nggak ketemu."}
        </h2>
        <Button onClick={() => router.push("/")} variant="default" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Balik dan upload CV
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-primary-foreground" />
            </div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              CV<span className="text-primary">Lint</span>
            </Link>
          </div>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Analyze New CV
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between sm:hidden">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Analyze New CV
          </Button>
        </div>
        <ReviewResult result={result} />
      </main>
    </div>
  );
}
