"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FileSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navbar */}
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

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <FileSearch className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-6">
              Masuk ke CV<span className="text-primary">Lint</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">
              Login dulu biar riwayat review CV lo tersimpan rapi dan bisa
              diakses kapan aja.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              size="lg"
              className="w-full h-14 text-base font-semibold gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Masuk pake Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium tracking-widest">
                  atau
                </span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              size="lg"
              className="w-full h-12 text-sm text-muted-foreground cursor-pointer"
            >
              Lanjut tanpa login (terbatas 2x/hari)
            </Button>
          </div>

          {/* Info */}
          <p className="text-center text-xs text-muted-foreground max-w-xs mx-auto">
            Dengan login, lo dapetin{" "}
            <strong className="text-foreground">5x review per hari</strong> dan
            riwayat analisis yang tersimpan otomatis.
          </p>
        </div>
      </main>
    </div>
  );
}
