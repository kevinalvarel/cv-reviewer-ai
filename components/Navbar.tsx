"use client";

import { FileSearch, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

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

        {/* Auth Controls */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              {/* User avatar */}
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full border-2 border-primary/30 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {(user.displayName || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Keluar</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Masuk</span>
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}
