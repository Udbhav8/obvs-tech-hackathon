"use client";

import React, { useState, useEffect } from "react";
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
  MapPin,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
} from "lucide-react";

interface Reports {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceType: string;
  date: string;
  time: string;
  status: "assigned" | "not-assigned" | "cancelled" | "completed";
  volunteer?: string;
  volunteerPhone?: string;
  pickupAddress: string;
  destinationAddress?: string;
  notes?: string;
  frequency: "one-time" | "ongoing" | "continuous";
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
    value: "assigned",
    label: "Assigned",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  {
    value: "not-assigned",
    label: "Not Assigned",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
];

const SERVICE_TYPES = [
  "Medical Drive",
  "Shopping Drive",
  "Recreation Drive",
  "Miscellaneous Drive",
  "Destination Walk",
  "Document Assistance",
  "Gardening",
  "Minor Home Repair",
  "Packing and Sorting",
  "Reassurance Phone Call",
  "Social Phone Call",
  "Technology Support",
  "Visiting",
  "Walking",
  "Wheelchair Push",
  "Miscellaneous Service",
];

const FREQUENCY_OPTIONS = [
  { value: "one-time", label: "One-Time" },
  { value: "ongoing", label: "Ongoing" },
  { value: "continuous", label: "Continuous" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("assigned");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceType: "",
    date: "",
    time: "",
    status: "not-assigned" as const,
    volunteer: "",
    volunteerPhone: "",
    pickupAddress: "",
    destinationAddress: "",
    notes: "",
    frequency: "one-time" as const,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, activeTab, searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockBookings: Booking[] = [
        {
          id: "1",
          clientName: "John Doe",
          clientEmail: "john.doe@example.com",
          clientPhone: "+1 (555) 123-4567",
          serviceType: "Medical Drive",
          date: "2024-12-20",
          time: "10:00",
          status: "assigned",
          volunteer: "Jane Smith",
          volunteerPhone: "+1 (555) 987-6543",
          pickupAddress: "123 Main St, City, State",
          destinationAddress: "456 Hospital Ave, City, State",
          notes: "Needs wheelchair assistance",
          frequency: "one-time",
          createdAt: "2024-12-15T10:30:00Z",
        },
        {
          id: "2",
          clientName: "Mary Johnson",
          clientEmail: "mary.johnson@example.com",
          clientPhone: "+1 (555) 456-7890",
          serviceType: "Shopping Drive",
          date: "2024-12-22",
          time: "14:00",
          status: "not-assigned",
          pickupAddress: "789 Oak St, City, State",
          destinationAddress: "SuperMart, City, State",
          notes: "Weekly grocery shopping",
          frequency: "ongoing",
          createdAt: "2024-12-16T09:15:00Z",
        },
        {
          id: "3",
          clientName: "Robert Wilson",
          clientEmail: "robert.wilson@example.com",
          serviceType: "Technology Support",
          date: "2024-12-18",
          time: "16:00",
          status: "completed",
          volunteer: "Mike Davis",
          pickupAddress: "321 Pine Ave, City, State",
          notes: "Help setting up tablet",
          frequency: "one-time",
          createdAt: "2024-12-10T14:20:00Z",
        },
        {
          id: "4",
          clientName: "Sarah Brown",
          clientEmail: "sarah.brown@example.com",
          clientPhone: "+1 (555) 321-0987",
          serviceType: "Recreation Drive",
          date: "2024-12-25",
          time: "13:00",
          status: "cancelled",
          pickupAddress: "654 Elm St, City, State",
          destinationAddress: "Community Center, City, State",
          notes: "Holiday event cancelled",
          frequency: "one-time",
          createdAt: "2024-12-14T11:45:00Z",
        },
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings.filter((booking) => booking.status === activeTab);

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.serviceType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.volunteer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
        id: editingBooking?.id || Date.now().toString(),
        createdAt: editingBooking?.createdAt || new Date().toISOString(),
      };

      if (editingBooking) {
        // Update existing booking
        setBookings(
          bookings.map((booking) =>
            booking.id === editingBooking.id
              ? { ...booking, ...bookingData }
              : booking
          )
        );
      } else {
        // Add new booking
        setBookings([...bookings, bookingData as Booking]);
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone || "",
      serviceType: booking.serviceType,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      volunteer: booking.volunteer || "",
      volunteerPhone: booking.volunteerPhone || "",
      pickupAddress: booking.pickupAddress,
      destinationAddress: booking.destinationAddress || "",
      notes: booking.notes || "",
      frequency: booking.frequency,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (bookingToDelete) {
      setBookings(
        bookings.filter((booking) => booking.id !== bookingToDelete.id)
      );
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      serviceType: "",
      date: "",
      time: "",
      status: "not-assigned",
      volunteer: "",
      volunteerPhone: "",
      pickupAddress: "",
      destinationAddress: "",
      notes: "",
      frequency: "one-time",
    });
    setEditingBooking(null);
  };

  const openDeleteDialog = (booking: Booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const duplicateBooking = (booking: Booking) => {
    const duplicatedBooking = {
      ...booking,
      id: Date.now().toString(),
      date: "",
      time: "",
      status: "not-assigned" as const,
      volunteer: "",
      volunteerPhone: "",
      createdAt: new Date().toISOString(),
    };
    setBookings([...bookings, duplicatedBooking]);
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
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, clientEmail: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Client Phone</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, clientPhone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceType: value })
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
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        frequency: value as
                          | "one-time"
                          | "ongoing"
                          | "continuous",
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <Input
                  id="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupAddress: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationAddress">Destination Address</Label>
                <Input
                  id="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destinationAddress: e.target.value,
                    })
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volunteer">Volunteer</Label>
                  <Input
                    id="volunteer"
                    value={formData.volunteer}
                    onChange={(e) =>
                      setFormData({ ...formData, volunteer: e.target.value })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volunteerPhone">Volunteer Phone</Label>
                  <Input
                    id="volunteerPhone"
                    value={formData.volunteerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        volunteerPhone: e.target.value,
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Booking["status"],
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
                placeholder="Search bookings..."
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
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No bookings found with status: {status.label}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span className="font-medium">
                                      {booking.clientName}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {booking.clientEmail}
                                  </div>
                                  {booking.clientPhone && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Phone className="h-3 w-3" />
                                      {booking.clientPhone}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {booking.serviceType}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {booking.frequency.charAt(0).toUpperCase() +
                                      booking.frequency.slice(1)}
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
                                    {booking.time}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {booking.volunteer ? (
                                  <div className="space-y-1">
                                    <div className="font-medium">
                                      {booking.volunteer}
                                    </div>
                                    {booking.volunteerPhone && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        {booking.volunteerPhone}
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
              Are you sure you want to delete the booking for{" "}
              {bookingToDelete?.clientName}? This action cannot be undone.
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
