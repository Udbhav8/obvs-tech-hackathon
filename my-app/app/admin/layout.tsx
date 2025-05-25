"use client";

import React, { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Home,
  LogOut,
  Settings,
  FileText,
  DollarSign,
  Search,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import SearchBar from "@/components/search/SearchBar";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Donations",
    url: "/admin/donations",
    icon: DollarSign,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not authenticated</h1>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-4">
              {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </div> */}
              <Image
                src="/image/OBVS-colour-logo.png"
                alt="OBVS colour logo"
                width={50}
                height={50}
              />
              <span className="font-semibold">OBVS Dashboard</span>
            </div>
            <div className="px-4 pb-4">
              <SearchBar />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{session.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <SidebarRail />
        </Sidebar>
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
