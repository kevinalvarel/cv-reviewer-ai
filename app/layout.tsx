import type { Metadata } from "next";
import { Architects_Daughter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const architects = Architects_Daughter({
  subsets: ["latin"],
  variable: "--font-architects",
  weight: "400",
});

export const metadata: Metadata = {
  title: "CV Reviewer AI",
  description:
    "AI-powered CV analysis tool focusing on ATS friendliness, impact metrics, and readability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, architects.variable)}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
