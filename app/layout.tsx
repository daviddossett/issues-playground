import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Issues",
  description: "Sample app to list GitHub Issues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
