import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import DropzoneArea from "./DropzoneArea";

interface HeroProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isProcessing: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function Hero({
  onFileSelect,
  selectedFile,
  onClearFile,
  isProcessing,
  error,
  onRetry,
}: HeroProps) {
  return (
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
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
            onClearFile={onClearFile}
            isProcessing={isProcessing}
          />

          {error && (
            <div className="w-full mt-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl shadow-sm text-sm text-left">
              <strong>Error:</strong> {error}
            </div>
          )}

          {selectedFile && !isProcessing && error && (
            <button
              onClick={onRetry}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              Coba Lagi Yuk <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
