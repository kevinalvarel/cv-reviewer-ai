"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewResult from "../../components/ReviewResult";
import { CVReviewResult } from "../../types";
import { ArrowLeft, FileSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  const [result, setResult] = useState<CVReviewResult | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const data = sessionStorage.getItem("cv_review_result");
    if (data) {
      try {
        setResult(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse result", e);
      }
    }
  }, []);

  // Avoid hydration mismatch by waiting for client
  if (!isClient) return <div className="min-h-screen bg-background" />;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h2 className="text-2xl font-bold mb-4">No analysis result found.</h2>
        <Button onClick={() => router.push("/")} variant="default" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back and upload CV
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
              CVReviewer<span className="text-primary">.ai</span>
            </Link>
          </div>
          <Button onClick={() => router.push("/")} variant="outline" size="sm" className="hidden sm:flex">
            <ArrowLeft className="w-4 h-4 mr-2" /> Analyze New CV
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between sm:hidden">
            <Button onClick={() => router.push("/")} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Analyze New CV
            </Button>
        </div>
        <ReviewResult result={result} />
      </main>
    </div>
  );
}
