import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lifeweft — Personal Life-Management & Memory Workspace",
  description: "A calm, personal workspace to manage what you need to do, remember, decide, plan, and learn across every area of your life.",
  keywords: ["lifeweft", "life management", "personal ledger", "memory workspace", "decision journal", "planner", "deadlines", "knowledge base"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-text font-sans select-none md:select-text">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
