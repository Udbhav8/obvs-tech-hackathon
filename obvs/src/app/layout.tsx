import { Inter } from "next/font/google";
import { Metadata } from "next";
import "../styles/globals.css";
import AuthProvider from "./components/AuthProvider";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MongoNext App",
  description: "Next.js application with MongoDB Atlas integration",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
