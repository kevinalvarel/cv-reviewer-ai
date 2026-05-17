import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-background/80 backdrop-blur-sm py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-black text-xl tracking-tight text-foreground">
            CV<span className="text-primary">Lint</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium text-center md:text-left max-w-xs">
            Dibuat dengan Gemini dan sedikit kecemasan masa depan pencari kerja.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            href="https://github.com/kevinalvarel"
            className="hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
