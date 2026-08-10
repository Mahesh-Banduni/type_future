import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppProvider from "@/context/AppProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TypeFuture — Premium Minimalist Typing Test Platform",
  description: "Improve your typing speed and accuracy with real-time feedback, detailed performance graphs, 300 custom paragraphs, and 14 premium customizable color themes.",
  keywords: ["typing test", "monkeytype", "10fastfingers", "speed typing", "wpm checker", "typefuture"],
  authors: [{ name: "TypeFuture Team" }],
  openGraph: {
    title: "TypeFuture — Premium Minimalist Typing Test Platform",
    description: "Improve your typing speed and accuracy with real-time feedback, detailed performance graphs, and custom themes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1117",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col theme-transition">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

