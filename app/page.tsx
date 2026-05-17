"use client";

import React, { useState, useEffect } from "react";
import DropzoneArea from "../components/DropzoneArea";
import { CVReviewResult } from "../types";
import { FileSearch, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "../components/DropzoneArea"; // Reusing cn utility
import Image from "next/image";

interface RecentAnalysis {
  id: number;
  filename: string;
  timestamp: number;
  result: CVReviewResult;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const router = useRouter();

  useEffect(() => {
    const recentRaw = localStorage.getItem("recent_analyses");
    if (recentRaw) {
      try {
        const recent = JSON.parse(recentRaw) as RecentAnalysis[];
        // Filter out items older than 24h
        const validRecent = recent.filter(
          (item) => Date.now() - item.timestamp < 24 * 60 * 60 * 1000,
        );
        setRecentAnalyses(validRecent);
        if (recent.length !== validRecent.length) {
          localStorage.setItem("recent_analyses", JSON.stringify(validRecent));
        }
      } catch (e) {
        console.error("Error parsing recent analyses", e);
      }
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      let data: any = null;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        let errorMsg = "Terjadi kesalahan saat memproses file.";
        if (data && data.error) {
          errorMsg = data.error;
        } else if (response.status === 413) {
          errorMsg =
            "Ukuran file terlalu besar. Harap unggah file yang lebih kecil.";
        } else {
          errorMsg = `Server error (${response.status}): Endpoint tidak mengembalikan JSON yang valid.`;
        }
        throw new Error(errorMsg);
      }

      if (!data) {
        throw new Error("Tidak ada data yang dikembalikan oleh server.");
      }

      // Save to sessionStorage for immediate view
      sessionStorage.setItem("cv_review_result", JSON.stringify(data));

      // Save to localStorage for recent analyses
      const recentRaw = localStorage.getItem("recent_analyses");
      let recent: RecentAnalysis[] = [];
      if (recentRaw) {
        try {
          recent = JSON.parse(recentRaw);
        } catch (e) {}
      }
      const newEntry: RecentAnalysis = {
        id: Date.now(),
        filename: file.name,
        timestamp: Date.now(),
        result: data,
      };
      recent.unshift(newEntry);
      localStorage.setItem("recent_analyses", JSON.stringify(recent));

      router.push("/result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const openRecent = (item: RecentAnalysis) => {
    sessionStorage.setItem("cv_review_result", JSON.stringify(item.result));
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-16">
      {/* Navbar */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-primary-foreground" />
            </div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              CV<span className="text-primary">.ai</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-12 px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-12">
          <div className="space-y-6 mt-4">
            <div className="relative py-4 md:py-8 w-full flex justify-center">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.3] md:leading-[1.2]">
                Optimize Your CV for <br className="hidden sm:block" />
                <span className="relative flex justify-center items-center mt-6 md:mt-10 mb-4 md:mb-8">
                  {/* Scratched Text */}
                  <span className="text-muted-foreground/50 text-xl sm:text-3xl md:text-5xl whitespace-nowrap">
                    19 Juta Lapangan Pekerjaan
                  </span>

                  {/* CrossOut Image */}
                  <Image
                    src="/images/CrossOut.png"
                    alt="CrossOut"
                    width={1000}
                    height={100}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] sm:w-[120%] h-auto object-contain z-10 pointer-events-none opacity-80"
                  />

                  {/* Overlay / Stamp Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] z-20 pointer-events-none">
                    <span className="font-architects text-4xl sm:text-6xl md:text-[6rem] font-black text-secondary whitespace-nowrap drop-shadow-2xl tracking-wide">
                      Maximum Impact
                    </span>
                  </div>
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get an instant, professional review of your resume. We analyze ATS
              friendliness, impact metrics, and readability to help you land
              your dream job.
            </p>
          </div>

          <div className="w-full max-w-xl bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm">
            <div className="flex-grow flex flex-col min-h-[300px]">
              <DropzoneArea
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClearFile={handleClearFile}
                isProcessing={isProcessing}
              />

              {error && (
                <div className="w-full mt-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl shadow-sm text-sm text-left">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {selectedFile && !isProcessing && error && (
                <button
                  onClick={() => handleFileSelect(selectedFile)}
                  className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  Try Again <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Analyses Section */}
        {recentAnalyses.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mt-20 pt-16 border-t border-border">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" /> Recent Analyses
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                To keep your privacy. This history will be{" "}
                <strong>removed in 24 hours</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentAnalyses.slice(0, 6).map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors duration-200"
                  onClick={() => openRecent(item)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-base truncate font-semibold"
                      title={item.filename}
                    >
                      {item.filename}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold",
                          item.result.score >= 80
                            ? "text-emerald-700 bg-emerald-100/50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
                            : item.result.score >= 60
                              ? "text-amber-700 bg-amber-100/50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400"
                              : "text-rose-700 bg-rose-100/50 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400",
                        )}
                      >
                        Score: {item.result.score}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
