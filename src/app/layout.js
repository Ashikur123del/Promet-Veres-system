import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/shard-compo/Navbar";
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/shard-compo/Footer';
import AuthTokenSync from "@/components/AuthTokenSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PromptVerse — AI Prompt Marketplace",
  description: "Discover, share, and manage AI prompts for ChatGPT, Gemini, Claude, Midjourney, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      data-theme="dark"
    >
      <body className="min-h-full flex flex-col">
        <AuthTokenSync />
        <Navbar />
        {children}
        <Footer />
        <ToastContainer />
        </body>
    </html>
  );
}
