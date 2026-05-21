"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveAnalysis, getAnalyses } from "@/lib/storage";
import FAQSection from "../components/FAQSection";
import Pricing from "@/components/Pricing";
import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import RecentAnalyses from "../components/RecentAnalyses";
import { RecentAnalysis } from "../types";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const router = useRouter();

  // Load recent analyses from localStorage
  useEffect(() => {
    setRecentAnalyses(getAnalyses());
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

      // Save to localStorage and navigate to result
      const analysisId = saveAnalysis(file.name, data);
      router.push(`/result/${analysisId}`);
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
    router.push(`/result/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-16">
      <Navbar />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-12 px-4 md:px-8">
        <Hero
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onClearFile={handleClearFile}
          isProcessing={isProcessing}
          error={error}
          onRetry={() => {
            if (selectedFile) handleFileSelect(selectedFile);
          }}
        />

        <RecentAnalyses
          analyses={recentAnalyses}
          onOpenRecent={openRecent}
        />
        {/* Joke Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </div>
  );
}
