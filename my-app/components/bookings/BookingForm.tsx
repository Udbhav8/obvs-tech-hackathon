"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { IBooking } from "@/models/Booking";
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
}

interface BookingFormData {
  booking_type: string;
  service_type: string;
  date: string;
  start_time: string;
  appointment_time: string;
  appointment_length: number;
  full_duration: number;
  status: string;
  frequency_type: string;
  num_volunteers_needed: number;
  pickup_address_description: string;
  pickup_address_street: string;
  pickup_address_city: string;
  destination_address_description: string;
  destination_address_street: string;
  destination_address_city: string;
  notes: string;
  client_confirmation: boolean;
}

interface BookingFormProps {
  formData: BookingFormData;
  setFormData: (data: BookingFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingBooking: BookingWithRelations | null;
  loading?: boolean;
}

const BOOKING_STATUSES = [
  { value: "Assigned", label: "Assigned" },
  { value: "Not Assigned", label: "Not Assigned" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
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

export default function BookingForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingBooking,
  loading = false,
}: BookingFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              setFormData({ ...formData, appointment_time: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appointment_length">Appointment Length (hours)</Label>
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
          <Label htmlFor="num_volunteers_needed">Volunteers Needed</Label>
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
              setFormData({ ...formData, pickup_address_city: e.target.value })
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
          <Label htmlFor="destination_address_street">Destination Street</Label>
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
          <Label htmlFor="destination_address_city">Destination City</Label>
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
                frequency_type: value,
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
                status: value,
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
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Optional notes"
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingBooking ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
