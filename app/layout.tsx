import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Kantinku"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="antialiased">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
        <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">Projek Kantinku</footer>
      </body>
    </html>
  );
}