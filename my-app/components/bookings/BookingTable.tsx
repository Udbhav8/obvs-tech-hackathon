"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { IBooking, IClient, IVolunteer } from "@/models/Booking";

// Extended interface for UI purposes with populated relations
interface BookingWithRelations extends Omit<IBooking, "date" | "_id"> {
  booking_type: string;
  service_type?: string;
  date: string; // UI expects string format
  // Include properties from IServiceProgramBooking for service bookings
  pickup_address_description?: string;
  pickup_address_street?: string;
  pickup_address_city?: string;
  destination_address_description?: string;
  destination_address_street?: string;
  destination_address_city?: string;
  // Include properties from IEventBooking for event bookings
  event_id?: number;
  location_description?: string;
  location_street?: string;
  location_city?: string;
  // Populated relations
  clients?: Array<
    IClient & {
      cell_phone?: string;
      home_phone?: string;
    }
  >;
  volunteers?: Array<
    IVolunteer & {
      status: string;
    }
  >;
  eventAttendees?: Array<{
    event_booking_id: number;
    user_id?: number;
    external_name?: string;
    user_type: string;
  }>;
  createdAt: string;
}

interface BookingTableProps {
  bookings: BookingWithRelations[];
  onEdit: (booking: BookingWithRelations) => void;
  onDelete: (booking: BookingWithRelations) => void;
  onDuplicate: (booking: BookingWithRelations) => void;
}

const BOOKING_STATUSES = [
  {
    value: "Assigned",
    label: "Assigned",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  {
    value: "Not Assigned",
    label: "Not Assigned",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  {
    value: "Completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
];

export default function BookingTable({
  bookings,
  onEdit,
  onDelete,
  onDuplicate,
}: BookingTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = BOOKING_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    const IconComponent = statusConfig.icon;
    return (
      <Badge className={statusConfig.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Volunteer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No bookings found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Volunteer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.booking_id}>
              <TableCell>
                <Link
                  href={`/admin/bookings/${booking.booking_id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  #{booking.booking_id}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {booking.clients?.[0] ? (
                    <>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium">
                          {booking.clients[0].preferred_name}{" "}
                          {booking.clients[0].last_name}
                        </span>
                      </div>
                      {booking.clients[0].cell_phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {booking.clients[0].cell_phone}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      No client assigned
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {booking.service_type || booking.booking_type}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.frequency_type}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {booking.appointment_time}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {booking.volunteers && booking.volunteers.length > 0 ? (
                  <div className="space-y-1">
                    <div className="font-medium">
                      {booking.volunteers[0].preferred_name}{" "}
                      {booking.volunteers[0].last_name}
                    </div>
                    {booking.volunteers[0].cell_phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {booking.volunteers[0].cell_phone}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/bookings/${booking.booking_id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(booking)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(booking)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(booking)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
