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
  let session = await getServerAuthSession();
  return (
    <TRPCReactProvider cookies={cookies().toString()}>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex flex-wrap items-center justify-between bg-slate-800 p-5">
            <div className="mr-6 flex flex-shrink-0 items-center text-white">
              <span className="text-xl font-semibold tracking-tight">
                zerodays challenge
              </span>
            </div>
            <div className="block lg:hidden">
              <button
                id="menu-button"
                className="flex items-center rounded border border-gray-400 px-3 py-2 text-gray-400 hover:border-white hover:text-white"
              >
                <img
                  className="h-6"
                  src="/static_files/svgs/bars-solid.svg"
                  alt="Menu"
                />
              </button>
            </div>
            <div
              id="menu"
              className="block w-full flex-grow lg:flex lg:w-auto lg:items-center"
            >
              <div className="text-sm lg:flex-grow">
                {session && (
                  <p className="mr-4 mt-4 block text-gray-300 lg:mt-0 lg:inline-block">
                    Prijavljen kot {session?.user.name}
                  </p>
                )}
                <Link href="/upload" legacyBehavior>
                  <a className="mr-4 mt-4 block text-gray-300 hover:text-white lg:mt-0 lg:inline-block">
                    Uploadaj sliko
                  </a>
                </Link>

                <Link
                  href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  legacyBehavior
                >
                  <a className="mt-4 block text-gray-300 hover:text-white lg:mt-0 lg:inline-block">
                    {session ? "Od" : "Pri"}java
                  </a>
                </Link>
              </div>
            </div>
          </div>
          {children}
        </body>
      </html>
    </TRPCReactProvider>
  );
}
