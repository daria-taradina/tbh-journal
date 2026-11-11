import type { Metadata } from "next";
import Background from "@/components/Background/Background";
import "./globals.css";

export const metadata: Metadata = {
  title: "TBH Journal",
  description: "A private diary with session-prep summaries",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Background />
        {children}
      </body>
    </html>
  );
}