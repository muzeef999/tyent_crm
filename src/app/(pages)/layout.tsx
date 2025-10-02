"use client";
import "@/app/globals.css";
import Sidebar from "@/components/ui/Sidebar";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import {  MarkingMangerOptionsfetch,  TechincianOptionsfetch } from "@/services/serviceApis";
import "react-quill/dist/quill.snow.css";

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

        <body className={` bg-background text-secondary`}>
          <Toaster richColors position="top-center" />

          <ReactQueryDevtools />

          <div className="flex">
            <Sidebar />

            <main className="flex flex-col flex-1   w-full rounded-xl bg-card-background h-screen">
              <div className="flex-1  overflow-auto">{children}</div>
            </main>
          </div>
        </body>
      </QueryClientProvider>
    </html>
  );
}

function PrefetchEmployees() {
  useQuery({
    queryKey: ["MarkingMangerOptions"],
    queryFn: () => MarkingMangerOptionsfetch,
  })
  useQuery({
    queryKey: ["TechincianOptions"],
    queryFn: () => TechincianOptionsfetch,
  })
  return null; // nothing to render
}
