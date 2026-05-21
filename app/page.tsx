"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const router = useRouter();

  // Fetch recent analyses from Firestore for authenticated users
  useEffect(() => {
    if (!user) {
      setRecentAnalyses([]);
      return;
    }

    const fetchRecent = async () => {
      try {
        const db = getClientDb();
        const analysesRef = collection(db, "users", user.uid, "analyses");
        const q = query(analysesRef, orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);

        const recent: RecentAnalysis[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            filename: data.filename,
            timestamp: data.createdAt?.toMillis?.() || Date.now(),
            result: {
              score: data.score,
              atsFriendliness: data.atsFriendliness,
              impactAndMetrics: data.impactAndMetrics,
              structureAndReadability: data.structureAndReadability,
              overallSummary: data.overallSummary,
            },
          };
        });

        setRecentAnalyses(recent);
      } catch (e) {
        console.error("Error fetching recent analyses", e);
      }
    };

    fetchRecent();
  }, [user]);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Build headers with auth token if available
      const headers: Record<string, string> = {};
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/review", {
        method: "POST",
        body: formData,
        headers,
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

      // If user is authenticated and got an analysisId, navigate to it
      if (user && data.analysisId) {
        router.push(`/result/${data.analysisId}`);
      } else {
        // Guest: store in sessionStorage and navigate to guest result
        sessionStorage.setItem("cv_review_result", JSON.stringify(data));
        router.push("/result/guest");
      }
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
