"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import DropzoneArea from "./DropzoneArea";

interface HeroProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isProcessing: boolean;
  error: string | null;
  onRetry: () => void;
}

// Easing helper
const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Variants for orchestrated stagger
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

const cardSpring: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      mass: 1,
    },
  },
};

const stampReveal: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -3,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14,
      delay: 0.65,
    },
  },
};

const crossOutReveal: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 0.95,
    scaleX: 1,
    transition: { duration: 0.5, ease: easeOutExpo, delay: 0.45 },
  },
};

export default function Hero({
  onFileSelect,
  selectedFile,
  onClearFile,
  isProcessing,
  error,
  onRetry,
}: HeroProps) {
  return (
    <motion.div
      className="w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-6 mt-4" variants={fadeSlideUp}>
        <div className="relative py-4 md:py-8 w-full flex justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.3] md:leading-[1.4]">
            Persiapkan CV lu buat
            <br className="hidden sm:block" />
            <span className="relative flex justify-center items-center mt-6 md:mt-10 mb-4 md:mb-8">
              {/* Scratched Text */}
              <span className="text-muted-foreground/90 text-xl sm:text-3xl md:text-5xl whitespace-nowrap">
                19 Juta Lapangan Pekerjaan
              </span>

              {/* CrossOut Image — wipes in from left */}
              <motion.div
                className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] sm:w-[120%] h-auto z-10 pointer-events-none"
                variants={crossOutReveal}
                style={{ originX: 0 }}
              >
                <Image
                  src="/images/CrossOut.png"
                  alt="CrossOut"
                  width={1000}
                  height={100}
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* Overlay / Stamp Text — bounces in */}
              <motion.div
                className="absolute -top-4 md:-top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                variants={stampReveal}
              >
                <span className="font-architects underline text-4xl sm:text-6xl md:text-[5rem] font-black text-primary whitespace-nowrap drop-shadow-2xl tracking-wide">
                  Hasil yang Maksimal
                </span>
              </motion.div>
            </span>
          </h1>
        </div>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          variants={fadeSlideUp}
        >
          Dapetin review CV instan ala HRD startup. Kita bakal bedah keramahan
          ATS, impact metrik, dan keterbacaan biar lo makin cepet dapet kerjaan
          impian!
        </motion.p>
      </motion.div>

      <motion.div
        className="w-full max-w-xl bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm"
        variants={cardSpring}
      >
        <div className="flex-grow flex flex-col min-h-[300px]">
          <DropzoneArea
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
            onClearFile={onClearFile}
            isProcessing={isProcessing}
          />

          {error && (
            <motion.div
              className="w-full mt-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl shadow-sm text-sm text-left"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <strong>Error:</strong> {error}
            </motion.div>
          )}

          {selectedFile && !isProcessing && error && (
            <motion.button
              onClick={onRetry}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Coba Lagi Yuk <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
