"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/ui/AppBar";
import Sidebar from "@/components/ui/Sidebar";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { getEmployees } from "@/services/serviceApis";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <PrefetchEmployees /> 
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-background text-secondary`}
        >
          <Toaster richColors position="top-center" />

          <ReactQueryDevtools />

          <div className="flex">
            <div className="fixed top-14 left-0 w-64 h-screen z-20">
              <Sidebar />
            </div>

            <main className="flex-1 ml-64 mt-14  rounded-xl  bg-card-background h-screen">
              <AppBar />
              {children}
            </main>
          </div>
        </body>
      </QueryClientProvider>
    </html>
  );
}


function PrefetchEmployees() {
  useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
  return null; // nothing to render
}