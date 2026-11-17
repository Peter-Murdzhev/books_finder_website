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
  metadataBase: new URL("https://books-hunter-web.vercel.app/"),

  title: "Books hunter",
  description: "Book library where you can find information about any book.",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification:{
    google: "nwcTlwQsUrdPqxDnLlag1nWxqjgFilg8ZBXfSLvo9Uo"
  }
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
            <Footer />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
