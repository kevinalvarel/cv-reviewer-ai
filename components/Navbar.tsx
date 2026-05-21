"use client";

import { FileSearch } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

export default function Navbar() {
  return (
    <motion.header
      className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8 max-w-6xl">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-primary-foreground" />
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight">
            CV<span className="text-primary">Lint</span>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
