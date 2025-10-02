export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFL Squares - Super Bowl Party",
  description: "Live NFL Squares board with real-time scoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
