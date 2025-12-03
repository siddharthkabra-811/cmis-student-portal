import { Toaster } from "@/components/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationProvider } from "@/lib/notification-context";
import Providers from "@/providers/QuertClientProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMIS Student Portal - Mays Business School",
  description: "Student portal for CMIS at Texas A&M Mays Business School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <Providers>
              {children}
              <Toaster />
            </Providers>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
