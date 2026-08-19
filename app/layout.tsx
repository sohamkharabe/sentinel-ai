import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OperationalStoreProvider } from "@/lib/operational-store";
import Sidebar from "@/components/dashboard/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suraksha Saarthi",
  description: "AI-powered community health and emergency response platform for Northeast India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><OperationalStoreProvider><Sidebar desktop /><div className="min-h-screen lg:pl-[280px]">{children}</div></OperationalStoreProvider></body>
    </html>
  );
}
