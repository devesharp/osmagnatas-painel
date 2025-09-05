import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner"
import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";

// if (process.env.NODE_ENV === 'development') {
// }

whyDidYouRender(React);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Os Magnatas",
  description: "Painel de controle do sistema Os Magnatas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>

        <Toaster richColors />
      </body>
    </html>
  );
}
