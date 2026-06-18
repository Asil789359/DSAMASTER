import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoMaster - Master Data Structures, Algorithms, and System Design",
  description: "Learn coding patterns visually. Prepare for technical software engineering interviews at FAANG and top tech startups with interactive visualizers, code playgrounds, and HLD case studies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
