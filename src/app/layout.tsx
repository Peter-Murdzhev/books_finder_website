import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import ScrollRestoration from "@/components/ScrollRestoration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Library",
  description: "Book library where you can find information about any book you want.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
        min-h-screen w-[90%]
        bg-yellow-50
        mx-auto
        `}
      >
        <AuthProvider>
          <ReactQueryProvider>
            <ScrollRestoration />
            <Navbar />
            {children}
          </ReactQueryProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
