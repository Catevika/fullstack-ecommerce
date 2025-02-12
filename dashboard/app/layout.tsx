import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StyledJsxRegistry from "./registry";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard for all your sellers needs: they can view their product catalog, view product details, create, update, delete any product, view order history, view order items and manage order status.",
  icons: [
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/android-chrome-192x192.png' },
    { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/android-chrome-512x512.png' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-slate-900`}
      ><StyledJsxRegistry>
          <GluestackUIProvider mode="light">
            {children}
          </GluestackUIProvider>
        </StyledJsxRegistry></body>
    </html>
  );
}
