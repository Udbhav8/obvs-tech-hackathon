"use client";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
// import Footer from "../../components/Footer"; // Footer might be part of the sidebar or handled differently
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface LayoutWithNavClientProps {
  children: ReactNode;
}

export default function LayoutWithNavClient({
  children,
}: LayoutWithNavClientProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Assuming SidebarProvider needs to wrap the content that uses the sidebar
  return (
    <SidebarProvider>
      {!isAdmin && (
        <Sidebar>{/* Sidebar content/items will likely go here */}</Sidebar>
      )}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {/* {!isAdmin && <Footer />} Footer might be integrated differently now */}
    </SidebarProvider>
  );
}
