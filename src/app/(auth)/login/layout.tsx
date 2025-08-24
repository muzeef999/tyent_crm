"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "@/app/globals.css";

const queryClient = new QueryClient();

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body>
          <Toaster richColors position="top-center" />
          {children}
        </body>
      </QueryClientProvider>
    </html>
  );
}
