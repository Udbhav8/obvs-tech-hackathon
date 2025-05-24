import { Inter } from "next/font/google";
import { Metadata } from "next";
import AuthProvider from "./components/AuthProvider";
import ThemeRegistry from "./components/ThemeRegistry";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import FloatingChatbot from "../components/FloatingChatbot";

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
      <body
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        className={inter.className}
      >
        <AuthProvider>
          <ThemeRegistry>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <FloatingChatbot />
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
