"use client";

import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <motion.footer
      className="w-full border-t border-border/50 bg-background/80 backdrop-blur-sm py-10 mt-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div
          className="flex flex-col items-center md:items-start gap-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="font-black text-xl tracking-tight text-foreground">
            CV<span className="text-primary">Lint</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium text-center md:text-left max-w-xs">
            Dibuat dengan Gemini dan sedikit kecemasan masa depan pencari kerja.
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="https://github.com/kevinalvarel"
            className="hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  );
}
