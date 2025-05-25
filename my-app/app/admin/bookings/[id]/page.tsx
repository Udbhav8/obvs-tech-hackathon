"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  History,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Flag,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  FileText,
  Plus,
} from "lucide-react";
import { IBooking, IClient, IVolunteer, IJobHistory } from "@/models/Booking";
import { CancellationReason } from "@/enums/booking-enums";

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
}

// Simplified job history interface for UI
interface JobHistoryEntry {
  history_id: number;
  action: string;
  timestamp: string;
  user_id: number;
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
    value: "Deleted",
    label: "Deleted",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
  {
    value: "Completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
];

const CANCELLATION_REASONS = Object.values(CancellationReason);

const VOLUNTEER_STATUSES = [
  "Possible",
  "Left Voicemail",
  "Emailed",
  "Assigned",
  "Unavailable",
  "1-Day Absence",
  "Unassigned",
];

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const [jobHistory, setJobHistory] = useState<JobHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [replicateDialogOpen, setReplicateDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [cancellationData, setCancellationData] = useState({
    reason: "",
    notes: "",
  });

  const [replicateData, setReplicateData] = useState({
    frequency: "One-Time",
    date: "",
    time: "",
    end_date: "",
    recurrence_frequency: "",
    recurrence_days: [] as number[],
  });

  useEffect(() => {
    fetchBookingDetails();
    fetchJobHistory();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        console.error("Failed to fetch booking:", data.error);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobHistory = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/history`);
      const data = await response.json();

      if (data.success) {
        setJobHistory(data.data);
      }
    } catch (error) {
      console.error("Error fetching job history:", error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cancellationData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchBookingDetails();
        setCancelDialogOpen(false);
        setCancellationData({ reason: "", notes: "" });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleReplicateBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/replicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(replicateData),
      });

      const data = await response.json();
      if (data.success) {
        setReplicateDialogOpen(false);
        router.push(`/admin/bookings/${data.data.booking_id}`);
      }
    } catch (error) {
      console.error("Error replicating booking:", error);
    }
  };

  const handleDeleteBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        router.push("/admin/bookings");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/bookings")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Booking not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/bookings")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Booking #{booking.booking_id}
            </h1>
            <p className="text-muted-foreground">
              {booking.clients?.[0]
                ? `Client: ${booking.clients[0].preferred_name} ${booking.clients[0].last_name}`
                : "Service Booking"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Job History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Job History</DialogTitle>
                <DialogDescription>
                  All actions taken on this booking
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date/Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobHistory.map((entry) => (
                      <TableRow key={entry.history_id}>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell>User {entry.user_id}</TableCell>
                        <TableCell>
                          {new Date(entry.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={replicateDialogOpen}
            onOpenChange={setReplicateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Replicate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Replicate Booking</DialogTitle>
                <DialogDescription>
                  Create a new booking based on this one
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={replicateData.frequency}
                    onValueChange={(value) =>
                      setReplicateData({ ...replicateData, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-Time">One-Time</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Continuous">Continuous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={replicateData.date}
                      onChange={(e) =>
                        setReplicateData({
                          ...replicateData,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={replicateData.time}
                      onChange={(e) =>
                        setReplicateData({
                          ...replicateData,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setReplicateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleReplicateBooking}>Create Booking</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Booking</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this booking? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteBooking}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Booking Status and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Client Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.clients?.map((client, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="font-medium">
                    {client.preferred_name} {client.last_name}
                    {client.is_primary && (
                      <Badge className="ml-2" variant="secondary">
                        Primary
                      </Badge>
                    )}
                  </div>

                  {client.internal_flags &&
                    client.internal_flags.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Internal Flags:
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {client.internal_flags.map(
                            (flag: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                <Flag className="h-3 w-3 mr-1" />
                                {flag}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {client.booking_flags && client.booking_flags.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Booking Flags:
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.booking_flags.map((flag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {client.allergies && (
                    <div className="text-sm">
                      <span className="font-medium">Allergies:</span>{" "}
                      {client.allergies}
                    </div>
                  )}

                  {client.mobility_aids && client.mobility_aids.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Mobility Aids:</span>{" "}
                      {client.mobility_aids.join(", ")}
                    </div>
                  )}

                  {client.disability && (
                    <div className="text-sm">
                      <span className="font-medium">Disability:</span>{" "}
                      {client.disability}
                    </div>
                  )}

                  <div className="text-sm">
                    <span className="font-medium">DNR:</span>{" "}
                    {client.dnr ? "Yes" : "No"}
                    {client.dnr_notes && (
                      <div className="text-muted-foreground">
                        {client.dnr_notes}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    {client.home_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">Home:</span>{" "}
                        {client.home_phone}
                      </div>
                    )}
                    {client.cell_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">Cell:</span>{" "}
                        {client.cell_phone}
                      </div>
                    )}
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Address:</span>
                    <div className="text-muted-foreground">
                      {client.home_address_street}
                      <br />
                      {client.home_address_city}
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-medium">Scent Sensitivity:</span>{" "}
                      {client.scent_sensitivity ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Smoking:</span>{" "}
                      {client.smoking ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Booking Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Details
                <Button size="sm" variant="outline" className="ml-auto">
                  <Edit className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Type
                  </div>
                  <div>{booking.service_type || booking.booking_type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Frequency
                  </div>
                  <div>{booking.frequency_type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Volunteers Needed
                  </div>
                  <div>{booking.num_volunteers_needed}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Date & Time
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">Start:</span>{" "}
                    {booking.start_time}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">Appointment:</span>{" "}
                    {booking.appointment_time}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Length:</span>{" "}
                    {booking.appointment_length}h
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Full Duration:</span>{" "}
                    {booking.full_duration}h
                  </div>
                </div>
              </div>

              {(booking.pickup_address_street || booking.location_street) && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Pickup Address
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-3 w-3 mt-1" />
                    <div>
                      {booking.pickup_address_description && (
                        <div className="font-medium">
                          {booking.pickup_address_description}
                        </div>
                      )}
                      {booking.pickup_address_street || booking.location_street}
                      <br />
                      {booking.pickup_address_city || booking.location_city}
                    </div>
                  </div>
                </div>
              )}

              {booking.destination_address_street && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Destination Address
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-3 w-3 mt-1" />
                    <div>
                      {booking.destination_address_description && (
                        <div className="font-medium">
                          {booking.destination_address_description}
                        </div>
                      )}
                      {booking.destination_address_street}
                      <br />
                      {booking.destination_address_city}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox checked={booking.client_confirmation} disabled />
                <span className="text-sm">Client Confirmation</span>
              </div>

              {booking.cancellation_reason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm font-medium text-red-800">
                    Cancelled
                  </div>
                  <div className="text-sm text-red-700">
                    Reason: {booking.cancellation_reason}
                  </div>
                  {booking.cancellation_notes && (
                    <div className="text-sm text-red-700 mt-1">
                      Notes: {booking.cancellation_notes}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap">
                  {booking.notes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Volunteer Assignment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Volunteer Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.volunteers && booking.volunteers.length > 0 ? (
                  booking.volunteers.map((volunteer, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="font-medium">
                        {volunteer.preferred_name} {volunteer.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Status: {volunteer.status}
                      </div>
                      {volunteer.cell_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {volunteer.cell_phone}
                        </div>
                      )}
                      {volunteer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {volunteer.email}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No volunteers assigned
                  </div>
                )}

                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Find Volunteers
                </Button>
              </div>
            </CardContent>
          </Card>

          {booking.status !== "Cancelled" && booking.status !== "Deleted" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog
                  open={cancelDialogOpen}
                  onOpenChange={setCancelDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Cancel Booking
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Booking</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for cancelling this booking
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Reason for Cancelling</Label>
                        <Select
                          value={cancellationData.reason}
                          onValueChange={(value) =>
                            setCancellationData({
                              ...cancellationData,
                              reason: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {CANCELLATION_REASONS.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes (optional)</Label>
                        <Textarea
                          value={cancellationData.notes}
                          onChange={(e) =>
                            setCancellationData({
                              ...cancellationData,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Additional notes..."
                          maxLength={200}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setCancelDialogOpen(false)}
                      >
                        Back
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancelBooking}
                        disabled={!cancellationData.reason}
                      >
                        Cancel Booking
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
