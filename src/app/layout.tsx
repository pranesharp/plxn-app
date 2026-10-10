import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PLXN — Visual Planner",
  description: "A visual project planner and infinite canvas workspace that turns scattered ideas into structured, actionable pipelines.",
  keywords: ["PLXN", "planner", "infinite canvas", "project", "workflow", "kanban", "whiteboard"],
  authors: [{ name: "PLXN" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "PLXN — Visual Planner",
    description: "A visual infinite-canvas project planner.",
    siteName: "PLXN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PLXN — Visual Planner",
    description: "A visual infinite-canvas project planner.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
