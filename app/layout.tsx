import type { Metadata } from "next";
import { Architects_Daughter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const architects = Architects_Daughter({
  subsets: ["latin"],
  variable: "--font-architects",
  weight: "400",
});

export const metadata: Metadata = {
  title: "CVLint",
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
      <body
        className="font-sans antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
