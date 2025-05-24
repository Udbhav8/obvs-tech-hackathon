import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono, Roboto } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//for titles
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: "400",
});

// const ibmPlexMono = IBM_Plex_Mono({
//   variable: "--font-ibm-plex-mono",
//   subsets: ["latin"],
// })

export const metadata: Metadata = {
  title: "My App Admin Dashboard",
  description: "Admin dashboard for managing users and bookings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${ibmPlexMono.variable} antialiased`}        
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
