"use client";

import React, { useState, useEffect } from "react";
import DropzoneArea from "../components/DropzoneArea";
import { CVReviewResult } from "../types";
import { ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FAQSection from "../components/FAQSection";
import { cn } from "../components/DropzoneArea"; // Reusing cn utility
import Image from "next/image";
import Pricing from "@/components/Pricing";
import Navbar from "@/components/Navbar";

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
        let errorMsg = "Waduh, ada error pas ngeproses file lu nih.";
        if (data && data.error) {
          errorMsg = data.error;
        } else if (response.status === 413) {
          errorMsg = "File-nya kegedean bro. Coba upload yang lebih kecil ya.";
        } else {
          errorMsg = `Server error (${response.status}): Endpoint ngambek, nggak ngasih JSON yang bener.`;
        }
        throw new Error(errorMsg);
      }

      if (!data) {
        throw new Error("Servernya nggak ngirim data apa-apa nih.");
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
      setError(err.message || "Yah, servernya lagi bermasalah.");
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
      <Navbar />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-12 px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
          <div className="space-y-6 mt-4">
            <div className="relative py-4 md:py-8 w-full flex justify-center">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.3] md:leading-[1.4]">
                Persiapkan CV lu buat
                <br className="hidden sm:block" />
                <span className="relative flex justify-center items-center mt-6 md:mt-10 mb-4 md:mb-8">
                  {/* Scratched Text */}
                  <span className="text-muted-foreground/90 text-xl sm:text-3xl md:text-5xl whitespace-nowrap">
                    19 Juta Lapangan Pekerjaan
                  </span>

                  {/* CrossOut Image */}
                  <Image
                    src="/images/CrossOut.png"
                    alt="CrossOut"
                    width={1000}
                    height={100}
                    className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] sm:w-[120%] h-auto object-contain z-10 pointer-events-none opacity-95"
                  />

                  {/* Overlay / Stamp Text */}
                  <div className="absolute -top-4 md:-top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] z-20 pointer-events-none">
                    <span className="font-architects underline text-4xl sm:text-6xl md:text-[5rem] font-black text-primary whitespace-nowrap drop-shadow-2xl tracking-wide">
                      Hasil yang Maksimal
                    </span>
                  </div>
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Dapetin review CV instan ala HRD startup. Kita bakal bedah
              keramahan ATS, impact metrik, dan keterbacaan biar lo makin cepet
              dapet kerjaan impian!
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
                  Coba Lagi Yuk <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Analyses Section */}
        {recentAnalyses.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mt-20 pt-16 border-t border-border">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" /> Riwayat Review Lo
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Biar privasi aman sentosa, riwayat ini bakal otomatis{" "}
                <strong>ilang dalam 24 jam</strong> ya bro.
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
        {/* Joke Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </div>
  );
}
