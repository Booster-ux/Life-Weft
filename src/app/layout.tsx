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
  title: "DailyDo — Your Day. Your Priorities. Your DailyDo.",
  description: "Organize your tasks, deadlines, plans, and everyday responsibilities in one simple daily command center.",
  keywords: ["planner", "task manager", "daily assistant", "student organizer", "life admin", "decisions organizer", "knowledge base"],
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
