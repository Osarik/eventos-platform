import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

export const metadata: Metadata = {
  title: {
    default: "Eventos Platform",
    template: "%s | Eventos Platform"
  },
  description:
    "Plataforma SaaS para crear eventos, vender entradas y validar tickets con QR."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={geistSans.variable}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
