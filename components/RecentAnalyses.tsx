"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "./DropzoneArea";
import { RecentAnalysis } from "../types";
import { motion, type Variants } from "motion/react";

interface RecentAnalysesProps {
  analyses: RecentAnalysis[];
  onOpenRecent: (item: RecentAnalysis) => void;
}

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 16,
    },
  },
};

export default function RecentAnalyses({
  analyses,
  onOpenRecent,
}: RecentAnalysesProps) {
  if (analyses.length === 0) return null;

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto mt-20 pt-16 border-t border-border"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="flex flex-col items-center text-center mb-10"
        variants={headingVariants}
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" /> Riwayat Review Lo
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Biar privasi aman sentosa, riwayat ini bakal otomatis{" "}
          <strong>ilang dalam 24 jam</strong> ya bro.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {analyses.slice(0, 6).map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors duration-200 h-full"
              onClick={() => onOpenRecent(item)}
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
