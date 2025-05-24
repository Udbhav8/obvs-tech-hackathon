"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

type EventCategory = "Program Events" | "Other Events";

interface Event {
    id: string;
    name: string;
    category: EventCategory;
    attendees: number;
    volunteers: number;
    hours: number;
    date: string;
}

export default function EventsPage() {
    const [showNewEvent, setShowNewEvent] = useState(false);

    // Mock data - replace with actual data from your backend
    const metrics = {
        totalEvents: 12,
        totalAttendees: 450,
        totalVolunteers: 85,
        totalHours: 320,
    };

    const programEvents: Event[] = [
        {
            id: "1",
            name: "Silent Disco",
            category: "Program Events",
            attendees: 120,
            volunteers: 15,
            hours: 45,
            date: "2024-03-15",
        },
        {
            id: "2",
            name: "Symphony",
            category: "Program Events",
            attendees: 200,
            volunteers: 20,
            hours: 60,
            date: "2024-03-20",
        },
    ];

    const otherEvents: Event[] = [
        {
            id: "3",
            name: "AGM",
            category: "Other Events",
            attendees: 50,
            volunteers: 10,
            hours: 20,
            date: "2024-03-25",
        },
        {
            id: "4",
            name: "Volunteer Appreciation Week",
            category: "Other Events",
            attendees: 80,
            volunteers: 40,
            hours: 120,
            date: "2024-04-01",
        },
    ];

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Events</h1>
                <Button onClick={() => setShowNewEvent(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Event
                </Button>
            </div>

            {/* Metrics Summary */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalAttendees}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalVolunteers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalHours}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Program Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Program Events</CardTitle>
                    <CardDescription>Events related to ongoing programs</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {programEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div>
                                    <h3 className="font-medium">{event.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm">
                                        <span className="font-medium">{event.attendees}</span> attendees
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">{event.volunteers}</span> volunteers
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">{event.hours}</span> hours
                                    </div>
                                    <Button variant="outline" asChild>
                                        <Link href={`/admin/events/${event.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Other Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Other Events</CardTitle>
                    <CardDescription>Special events and gatherings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {otherEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div>
                                    <h3 className="font-medium">{event.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm">
                                        <span className="font-medium">{event.attendees}</span> attendees
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">{event.volunteers}</span> volunteers
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">{event.hours}</span> hours
                                    </div>
                                    <Button variant="outline" asChild>
                                        <Link href={`/admin/events/${event.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
