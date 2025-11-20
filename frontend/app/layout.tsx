import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Provider from "../components/Provider";
import { Toaster } from "../components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArtToy Pre-Order",
  description: "SW DEV II class's project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
