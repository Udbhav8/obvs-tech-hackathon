"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, User, Shield } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Image
            className="dark:invert mx-auto mb-8"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
          <p className="text-xl text-muted-foreground">
            A modern admin dashboard with user and booking management
          </p>
        </div>

        {session ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Welcome back, {session.user?.name}!
              </CardTitle>
              <CardDescription>
                You are currently signed in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{session.user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {(session.user as ExtendedUser)?.role === "admin" ? (
                        <>
                          <Shield className="h-3 w-3" />
                          Administrator
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          User
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                {(session.user as ExtendedUser)?.role === "admin" && (
                  <Button asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in to access your account and manage your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive user management with categories, roles, and
                detailed profiles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete booking management with status tracking, volunteer
                assignment, and scheduling.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Modern admin interface built with shadcn/ui components and
                real-time updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
