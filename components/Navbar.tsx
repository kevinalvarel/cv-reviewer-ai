import { FileSearch } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-primary-foreground" />
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight">
            CV<span className="text-primary">Lint</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
