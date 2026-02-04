import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ava AI - Your Personal AI Assistant",
  description: "Stop juggling multiple apps. Let Ava manage your calendars, schedule, and life. The personal assistant for everyone.",
  keywords: ["AI assistant", "personal assistant", "calendar management", "productivity", "time management"],
  authors: [{ name: "Ava AI" }],
  openGraph: {
    title: "Ava AI - Your Personal AI Assistant",
    description: "The personal AI assistant that CEOs have, now for everyone. $19/month.",
    type: "website",
    url: "https://tryava.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ava AI - Your Personal AI Assistant",
    description: "Stop juggling multiple apps. Let Ava manage your life.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
