import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent Summary Dashboard",
  description: "Cyber AI summary interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          bg-gradient-to-br from-purple-900 via-purple-950 to-black
          text-white min-h-screen
        `}
      >
        <div className="min-h-screen max-w-7xl mx-auto p-6">{children}</div>
      </body>

    </html>
  );
}
