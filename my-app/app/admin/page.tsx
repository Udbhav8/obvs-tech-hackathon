"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, Coins, TrendingUp, Activity } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  activeBookings: number;
  recentActivity: number;

  totalDonations: number;
  totalClients: number;
  totalVolunteers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    activeBookings: 0,
    recentActivity: 0,
    totalDonations: 0,
    totalClients: 0,
    totalVolunteers: 0.
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalUsers: 150,
        totalBookings: 89,
        activeBookings: 23,
        recentActivity: 7,
        totalDonations: 1234,
        totalClients: 22,
        totalVolunteers: 13,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  //Here
  const jobs = [
    {
      id: "45615",
      client: "not confirmed",
      type: "Drives Medical",
      recurring: "One Time",
      date: "Wed, Apr 23, 2025 11:20am",
      duration: "1",
      status: "Not Assigned",
    },
    {
      id: "45616",
      client: "not confirmed",
      type: "Drives Medical",
      recurring: "One Time",
      date: "Wed, Apr 23, 2025 11:20am",
      duration: "1",
      status: "Not Assigned",
    },
    {
      id: "44256",
      client: "not confirmed",
      type: "Income Tax",
      recurring: "One Time",
      date: "Fri, Apr 25, 2025 10:00am",
      duration: "2",
      status: "Not Assigned",
    },
  ];
  //End

  //Here
  
  //End
  const dashboardCards = [
    {
      title: "Total Donations",
      description: "All donations",
      value: stats.totalDonations,
      icon: Coins,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Bookings",
      description: "Currently active",
      value: stats.activeBookings,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Clients",
      description: "All registered clients",
      value: stats.totalClients,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Volunteers",
      description: "All registered volunteers",
      value: stats.totalVolunteers,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    
  ];

  const tags = Array.from({ length: 25 }).map(
    //placeholder data
    (_, i, a) => `Fake Annoucement Data ${a.length - i}: Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Here&apos;s an overview of your
          system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div
                className={`h-8 w-8 rounded-lg ${card.bgColor} flex items-center justify-center`}
              >
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-full">
        <Card>
          <CardHeader>
          <CardTitle>Annoucements</CardTitle>
          <CardDescription>Annoucements submitted to the team journal</CardDescription>
          </CardHeader>
          <CardContent>
          <ScrollArea className="h-72 rounded-md border">
            <div className="p-4">
              {/* <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4> */}
              {tags.map((tag) => (
                <React.Fragment key={tag}>
                  <div className="text-m">
                    {tag}
                  </div>
                  <Separator className="mt-2 mb-2"/>
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
          </CardContent>
          
        </Card>
      </div>


      /* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
                <Badge variant="outline">2 min ago</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Booking confirmed</p>
                  <p className="text-xs text-muted-foreground">
                    Medical appointment drive
                  </p>
                </div>
                <Badge variant="outline">5 min ago</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Booking cancelled</p>
                  <p className="text-xs text-muted-foreground">
                    Shopping drive
                  </p>
                </div>
                <Badge variant="outline">15 min ago</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">User updated profile</p>
                  <p className="text-xs text-muted-foreground">
                    jane.smith@example.com
                  </p>
                </div>
                <Badge variant="outline">30 min ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>System overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Pending Bookings
                </span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Users
                </span>
                <Badge variant="secondary">89</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Volunteers Available
                </span>
                <Badge variant="secondary">34</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <Badge variant="secondary">+23%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-7">
  <CardHeader>
    <CardTitle>Upcoming Jobs Next 14 Days</CardTitle>
    <CardDescription>Volunteer jobs scheduled within the next two weeks</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">View Job ID</th>
            <th className="px-4 py-2">View Client</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Recurring</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Duration (hrs)</th>
            <th className="px-4 py-2">Job History</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="px-4 py-2">
              <Badge variant="secondary">Assigned</Badge>
            </td>
            <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">#2043</td>
            <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">John Doe</td>
            <td className="px-4 py-2">Grocery Delivery</td>
            <td className="px-4 py-2">No</td>
            <td className="px-4 py-2">April 26, 10:00 AM</td>
            <td className="px-4 py-2">1.5</td>
            <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">View</td>
          </tr>
          <tr>
            <td className="px-4 py-2">
              <Badge variant="secondary">Available</Badge>
            </td>
            <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">#2051</td>
            <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">Jane Smith</td>
            <td className="px-4 py-2">Medical Escort</td>
            <td className="px-4 py-2">Yes</td>
            <td className="px-4 py-2">April 27, 2:00 PM</td>
            <td className="px-4 py-2">2</td>
            <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">View</td>
          </tr>
          {}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
}
