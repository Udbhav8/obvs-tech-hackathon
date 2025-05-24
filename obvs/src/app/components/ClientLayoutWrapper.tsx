"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";
import LayoutWithNavClient from "./LayoutWithNavClient";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({
  children,
}: ClientLayoutWrapperProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <LayoutWithNavClient>{children}</LayoutWithNavClient>
    </Box>
  );
}
