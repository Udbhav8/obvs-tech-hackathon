"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
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
import { ServiceProgramType } from "@/enums/booking-enums";

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

interface BookingStatus {
  value: string;
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BOOKING_STATUSES: BookingStatus[] = [
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

const SERVICE_TYPES = Object.values(ServiceProgramType);

const FREQUENCY_OPTIONS = [
  { value: "One-Time", label: "One-Time" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Continuous", label: "Continuous" },
];

const BOOKING_TYPES = [
  { value: "Service", label: "Service" },
  { value: "Program", label: "Program" },
  { value: "Support Service", label: "Support Service" },
  { value: "Event", label: "Event" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<
    BookingWithRelations[]
  >([]);
  const [activeTab, setActiveTab] = useState("Not Assigned");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] =
    useState<BookingWithRelations | null>(null);
  const [bookingToDelete, setBookingToDelete] =
    useState<BookingWithRelations | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const [formData, setFormData] = useState({
    booking_type: "Service",
    service_type: "",
    date: new Date().toISOString().split("T")[0],
    start_time: new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    appointment_time: new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    appointment_length: 1,
    full_duration: 1,
    status: "Not Assigned",
    frequency_type: "One-Time",
    num_volunteers_needed: 1,
    pickup_address_description: "",
    pickup_address_street: "",
    pickup_address_city: "",
    destination_address_description: "",
    destination_address_street: "",
    destination_address_city: "",
    notes: "",
    client_confirmation: false,
  });

  useEffect(() => {
    fetchBookings();
  }, [activeTab, pagination.page]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: activeTab,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/bookings?${params}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch bookings:", data.error);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter((booking) => {
      const clientName = booking.clients?.[0]
        ? `${booking.clients[0].preferred_name} ${booking.clients[0].last_name}`.toLowerCase()
        : "";
      const serviceType = (
        booking.service_type ||
        booking.booking_type ||
        ""
      ).toLowerCase();
      const volunteerName = booking.volunteers?.[0]
        ? `${booking.volunteers[0].preferred_name} ${booking.volunteers[0].last_name}`.toLowerCase()
        : "";
      const bookingId = booking.booking_id.toString();

      return (
        clientName.includes(searchTerm.toLowerCase()) ||
        serviceType.includes(searchTerm.toLowerCase()) ||
        volunteerName.includes(searchTerm.toLowerCase()) ||
        bookingId.includes(searchTerm)
      );
    });

    setFilteredBookings(filtered);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bookingData = {
        ...formData,
        created_by_user_id: 1, // Should come from auth context
      };

      let response;
      if (editingBooking) {
        // Update existing booking
        response = await fetch(`/api/bookings/${editingBooking.booking_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...bookingData, updated_by_user_id: 1 }),
        });
      } else {
        // Create new booking
        response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
      }

      const data = await response.json();
      if (data.success) {
        setDialogOpen(false);
        resetForm();
        fetchBookings();
      } else {
        console.error("Failed to save booking:", data.error);
      }
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleEdit = (booking: BookingWithRelations) => {
    setEditingBooking(booking);
    setFormData({
      booking_type: booking.booking_type,
      service_type: booking.service_type || "",
      date: booking.date.split("T")[0],
      start_time: booking.start_time,
      appointment_time: booking.appointment_time,
      appointment_length: booking.appointment_length,
      full_duration: booking.full_duration,
      status: booking.status,
      frequency_type: booking.frequency_type,
      num_volunteers_needed: booking.num_volunteers_needed,
      pickup_address_description: booking.pickup_address_description || "",
      pickup_address_street: booking.pickup_address_street || "",
      pickup_address_city: booking.pickup_address_city || "",
      destination_address_description:
        booking.destination_address_description || "",
      destination_address_street: booking.destination_address_street || "",
      destination_address_city: booking.destination_address_city || "",
      notes: booking.notes || "",
      client_confirmation: booking.client_confirmation,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (bookingToDelete) {
      try {
        const response = await fetch(
          `/api/bookings/${bookingToDelete.booking_id}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();
        if (data.success) {
          fetchBookings();
          setDeleteDialogOpen(false);
          setBookingToDelete(null);
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      booking_type: "Service",
      service_type: "",
      date: new Date().toISOString().split("T")[0],
      start_time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      appointment_time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      appointment_length: 1,
      full_duration: 1,
      status: "Not Assigned",
      frequency_type: "One-Time",
      num_volunteers_needed: 1,
      pickup_address_description: "",
      pickup_address_street: "",
      pickup_address_city: "",
      destination_address_description: "",
      destination_address_street: "",
      destination_address_city: "",
      notes: "",
      client_confirmation: false,
    });
    setEditingBooking(null);
  };

  const openDeleteDialog = (booking: BookingWithRelations) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const duplicateBooking = async (booking: BookingWithRelations) => {
    try {
      const response = await fetch(
        `/api/bookings/${booking.booking_id}/replicate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            frequency: "One-Time",
            date: new Date().toISOString().split("T")[0],
            time: booking.appointment_time,
            created_by_user_id: 1,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Error duplicating booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-96 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage all service bookings in the system
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBooking ? "Edit Booking" : "Add New Booking"}
              </DialogTitle>
              <DialogDescription>
                {editingBooking
                  ? "Update booking information"
                  : "Create a new service booking"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="booking_type">Booking Type</Label>
                  <Select
                    value={formData.booking_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, booking_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select booking type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKING_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, service_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment_time">Appointment Time</Label>
                  <Input
                    id="appointment_time"
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointment_time: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment_length">
                    Appointment Length (hours)
                  </Label>
                  <Input
                    id="appointment_length"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    value={formData.appointment_length}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointment_length: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_duration">Full Duration (hours)</Label>
                  <Input
                    id="full_duration"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    value={formData.full_duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        full_duration: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num_volunteers_needed">
                    Volunteers Needed
                  </Label>
                  <Select
                    value={formData.num_volunteers_needed.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        num_volunteers_needed: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup_address_description">
                  Pickup Address Description
                </Label>
                <Input
                  id="pickup_address_description"
                  value={formData.pickup_address_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickup_address_description: e.target.value,
                    })
                  }
                  placeholder="e.g., Home Address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup_address_street">Pickup Street</Label>
                  <Input
                    id="pickup_address_street"
                    value={formData.pickup_address_street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup_address_street: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup_address_city">Pickup City</Label>
                  <Input
                    id="pickup_address_city"
                    value={formData.pickup_address_city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup_address_city: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination_address_description">
                  Destination Address Description
                </Label>
                <Input
                  id="destination_address_description"
                  value={formData.destination_address_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destination_address_description: e.target.value,
                    })
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_address_street">
                    Destination Street
                  </Label>
                  <Input
                    id="destination_address_street"
                    value={formData.destination_address_street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination_address_street: e.target.value,
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_address_city">
                    Destination City
                  </Label>
                  <Input
                    id="destination_address_city"
                    value={formData.destination_address_city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination_address_city: e.target.value,
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency_type">Frequency</Label>
                  <Select
                    value={formData.frequency_type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        frequency_type: value as typeof formData.frequency_type,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as typeof formData.status,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKING_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Optional notes"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBooking ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Management
          </CardTitle>
          <CardDescription>
            View and manage service bookings by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings by client, service, volunteer, or booking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                {BOOKING_STATUSES.map((status) => (
                  <TabsTrigger key={status.value} value={status.value}>
                    {status.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {BOOKING_STATUSES.map((status) => (
                <TabsContent key={status.value} value={status.value}>
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
                        {filteredBookings.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No bookings found with status: {status.label}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBookings.map((booking) => (
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
                                    {booking.service_type ||
                                      booking.booking_type}
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
                                    {new Date(
                                      booking.date
                                    ).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {booking.appointment_time}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {booking.volunteers &&
                                booking.volunteers.length > 0 ? (
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
                                  <span className="text-muted-foreground">
                                    Not assigned
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(booking.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/admin/bookings/${booking.booking_id}`}
                                      >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEdit(booking)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => duplicateBooking(booking)}
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => openDeleteDialog(booking)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-between space-x-2 py-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
                        to{" "}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}{" "}
                        of {pagination.total} bookings
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              page: prev.page - 1,
                            }))
                          }
                          disabled={pagination.page <= 1}
                        >
                          Previous
                        </Button>
                        <div className="text-sm">
                          Page {pagination.page} of {pagination.pages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              page: prev.page + 1,
                            }))
                          }
                          disabled={pagination.page >= pagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete booking #
              {bookingToDelete?.booking_id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
