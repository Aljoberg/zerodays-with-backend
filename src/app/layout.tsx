import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { TRPCReactProvider } from "~/trpc/react";
import { cookies } from "next/headers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zerodays :D",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider cookies={cookies().toString()}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </TRPCReactProvider>
  );
}
