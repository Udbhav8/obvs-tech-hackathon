"use client";

import { ReactNode } from "react";
import LayoutWithNavClient from "./LayoutWithNavClient";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({
  children,
}: ClientLayoutWrapperProps) {
  return (
    <div>
    <LayoutWithNavClient>{children}</LayoutWithNavClient>
    </div>
  );
}
