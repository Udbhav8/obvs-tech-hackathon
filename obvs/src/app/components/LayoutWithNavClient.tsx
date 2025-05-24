"use client";

import Navbar from "../../components/Navbar";
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
  return (
    <>
      {!isAdmin && <Navbar />}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </>
  );
}
