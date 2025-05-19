import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Bugün Ne İzlesem | Film ve Dizi Önerileri",
  description: "Günlük film ve dizi önerileri, kişisel izleme günlüğü ve daha fazlası. Film ve dizi tutkunları için özel olarak tasarlanmış platform.",
  keywords: ["film", "dizi", "öneri", "izleme günlüğü", "film önerileri", "dizi önerileri", "bugün ne izlesem"],
  authors: [{ name: "Bugün Ne İzlesem" }],
  creator: "Bugün Ne İzlesem",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://bugunneizlesem.com",
    title: "Bugün Ne İzlesem | Film ve Dizi Önerileri",
    description: "Günlük film ve dizi önerileri, kişisel izleme günlüğü ve daha fazlası.",
    siteName: "Bugün Ne İzlesem",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bugün Ne İzlesem | Film ve Dizi Önerileri",
    description: "Günlük film ve dizi önerileri, kişisel izleme günlüğü ve daha fazlası.",
    creator: "@bugunneizlesem",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen bg-light-100 dark:bg-dark-100 text-dark-100 dark:text-light-100 flex flex-col">
        <UserProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
