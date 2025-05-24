"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
  ContentCopy as ReplicateIcon,
  History as HistoryIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";

interface BookingStatus {
  value: string;
  label: string;
  color: string;
}

const BOOKING_STATUSES: BookingStatus[] = [
  { value: "assigned", label: "Assigned", color: "#4caf50" },
  { value: "not-assigned", label: "Not Assigned", color: "#ff9800" },
  { value: "cancelled", label: "Cancelled", color: "#f44336" },
  { value: "deleted", label: "Deleted", color: "#9e9e9e" },
];

interface BookingTypes {
  services: string[];
  programs: string[];
  supportServices: string[];
}

const BOOKING_TYPES: BookingTypes = {
  services: [
    "Drives Medical",
    "Drives Miscellaneous",
    "Drives Shopping",
    "Drives Recreation",
    "Destination Walks",
    "Document Assistance",
    "Gardening",
    "Minor Home Repair",
    "Packing and Sorting",
    "Reassurance Phone Calls",
    "Social Phone Call",
    "Technology Support",
    "Visiting",
    "Visiting with Drive",
    "Walking",
    "Walking with Drive",
    "Wheelchair Push",
    "Miscellaneous Service",
  ],
  programs: [
    "Ambassador",
    "Companion Pets",
    "Cultural Companions",
    "Holiday Gift Exchange",
    "Income Tax",
    "Silent Disco",
    "Snow Angels",
    "Welcome Team",
  ],
  supportServices: [
    "Accounting",
    "Board",
    "Fundraising",
    "Helpline",
    "MarComm",
    "Miscellaneous Support",
    "Training",
  ],
};

interface FrequencyOption {
  value: string;
  label: string;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: "one-time", label: "One-Time" },
  { value: "ongoing", label: "Ongoing" },
  { value: "continuous", label: "Continuous" },
];

const VOLUNTEER_STATUSES: string[] = [
  "Possible",
  "Left Voicemail",
  "Emailed",
  "Assigned",
  "Unavailable",
  "1-Day Absence",
  "Unassigned",
];

const CANCEL_REASONS: string[] = [
  "Client - Provider",
  "Client - Health",
  "Client - Other",
  "Volunteer - Health",
  "Volunteer - Other",
  "No Volunteers Available",
];

interface Client {
  id: number;
  name: string;
  flags: string[];
  bookingFlags: string[];
}

interface Volunteer {
  id: number;
  name: string;
  phone: string;
  email: string;
  flags: string[];
  status: string;
}

interface Booking {
  id: string;
  clientName: string;
  type: string;
  date: string;
  time: string;
  status: string;
  volunteer: string | null;
  frequency: string;
}

interface NewBookingForm {
  bookingId: string;
  client: Client | null;
  additionalClients: Client[];
  bookingType: keyof BookingTypes;
  serviceType: string;
  date: string;
  startTime: string;
  appointmentTime: string;
  appointmentLength: string;
  fullDuration: string;
  pickupAddress: {
    description: string;
    street: string;
    city: string;
  };
  destinationAddress: {
    description: string;
    street: string;
    city: string;
  };
  notes: string;
  frequency: string;
  volunteersNeeded: number;
  volunteer: Volunteer | null;
  status: string;
}

interface CancelForm {
  reason: string;
  notes: string;
  clientConfirmation: boolean;
}

export default function BookingsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [openNewBooking, setOpenNewBooking] = useState<boolean>(false);
  const [openBookingDetail, setOpenBookingDetail] = useState<boolean>(false);
  const [openEventBooking, setOpenEventBooking] = useState<boolean>(false);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [openReplicateDialog, setOpenReplicateDialog] =
    useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Form states
  const [newBookingForm, setNewBookingForm] = useState<NewBookingForm>({
    bookingId: "",
    client: null,
    additionalClients: [],
    bookingType: "services",
    serviceType: "",
    date: new Date().toISOString().split("T")[0],
    startTime: new Date().toTimeString().slice(0, 5),
    appointmentTime: "",
    appointmentLength: "1",
    fullDuration: "1",
    pickupAddress: {
      description: "Home Address",
      street: "",
      city: "",
    },
    destinationAddress: {
      description: "",
      street: "",
      city: "",
    },
    notes: "",
    frequency: "one-time",
    volunteersNeeded: 1,
    volunteer: null,
    status: "not-assigned",
  });

  const [cancelForm, setCancelForm] = useState<CancelForm>({
    reason: "",
    notes: "",
    clientConfirmation: false,
  });

  // Mock data for demonstration
  const mockClients: Client[] = [
    {
      id: 1,
      name: "John Smith",
      flags: ["Internal Flag 1"],
      bookingFlags: ["Booking Flag 1"],
    },
    {
      id: 2,
      name: "Jane Doe",
      flags: ["Internal Flag 2"],
      bookingFlags: ["Booking Flag 2"],
    },
    { id: 3, name: "Bob Johnson", flags: [], bookingFlags: ["Booking Flag 3"] },
  ];

  const mockVolunteers: Volunteer[] = [
    {
      id: 1,
      name: "Mary Wilson",
      phone: "555-0101",
      email: "mary@example.com",
      flags: ["Certified"],
      status: "Possible",
    },
    {
      id: 2,
      name: "Tom Brown",
      phone: "555-0102",
      email: "tom@example.com",
      flags: ["Driver"],
      status: "Available",
    },
  ];

  const mockBookings: Booking[] = [
    {
      id: "B-001",
      clientName: "John Smith",
      type: "Drives Medical",
      date: "2024-01-15",
      time: "10:00",
      status: "assigned",
      volunteer: "Mary Wilson",
      frequency: "one-time",
    },
    {
      id: "B-002",
      clientName: "Jane Doe",
      type: "Social Phone Call",
      date: "2024-01-16",
      time: "14:00",
      status: "not-assigned",
      volunteer: null,
      frequency: "ongoing",
    },
  ];

  useEffect(() => {
    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
  }, []);

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
    formSetter: React.Dispatch<React.SetStateAction<any>>,
    formType: string
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    // Need to account for Checkbox type, since it uses `checked` instead of `value`
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    formSetter((prev: any) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleAutocompleteChange = (
    newValue: any,
    formSetter: React.Dispatch<React.SetStateAction<any>>,
    name: string
  ) => {
    formSetter((prev: any) => ({ ...prev, [name]: newValue }));
  };

  const filterBookings = () => {
    const filtered = bookings.filter(
      (booking) =>
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.volunteer &&
          booking.volunteer.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    filterBookings();
  }, [searchTerm, bookings]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNewBooking = () => {
    setOpenNewBooking(true);
  };

  const handleNewEventBooking = () => {
    setOpenEventBooking(true);
  };

  const handleBookingSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to add or update booking
    const newId = `B-${String(bookings.length + 1).padStart(3, "0")}`;
    const bookingToAdd = {
      ...newBookingForm,
      id: selectedBooking ? selectedBooking.id : newId,
      clientName: newBookingForm.client?.name || "Unknown Client",
      type: newBookingForm.serviceType,
      time: newBookingForm.startTime,
      volunteer: newBookingForm.volunteer?.name || null,
    };

    if (selectedBooking) {
      setBookings(
        bookings.map((b) => (b.id === selectedBooking.id ? bookingToAdd : b))
      );
    } else {
      setBookings([...bookings, bookingToAdd]);
    }
    setOpenNewBooking(false);
    setSelectedBooking(null);
    // Reset form if needed
  };

  const handleCancelBooking = () => {
    // Logic to cancel booking
    setOpenCancelDialog(false);
  };

  const getStatusColor = (status: string): string => {
    const foundStatus = BOOKING_STATUSES.find((s) => s.value === status);
    return foundStatus ? foundStatus.color : "#000000";
  };

  const needsDestinationAddress = (serviceType: string): boolean => {
    return (
      BOOKING_TYPES.services.includes(serviceType) &&
      serviceType.toLowerCase().includes("drive")
    );
  };

  const replicateBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenReplicateDialog(true);
  };

  const handleReplicateSubmit = () => {
    // Logic to create new booking based on selectedBooking and replication options
    setOpenReplicateDialog(false);
    setSelectedBooking(null);
  };

  // Render helper for booking type selection
  const renderBookingTypeOptions = () => {
    const types = BOOKING_TYPES[newBookingForm.bookingType] || [];
    return types.map((type: string) => (
      <MenuItem key={type} value={type}>
        {type}
      </MenuItem>
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bookings Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Search Bookings"
          variant="outlined"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            ),
          }}
          sx={{ width: "40%" }}
        />
        <Box>
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            onClick={handleNewEventBooking}
            sx={{ mr: 1 }}
          >
            New Event Booking
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewBooking}
          >
            New Booking
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Bookings" />
        <Tab label="Assigned" />
        <Tab label="Not Assigned" />
        <Tab label="Cancelled" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Volunteer</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.clientName}</TableCell>
                <TableCell>{booking.type}</TableCell>
                <TableCell>{`${booking.date} ${booking.time}`}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status.replace("-", " ").toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(booking.status),
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell>{booking.volunteer || "N/A"}</TableCell>
                <TableCell>{booking.frequency}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedBooking(booking);
                      setNewBookingForm({
                        ...newBookingForm, // Spread existing form data
                        bookingId: booking.id,
                        client:
                          mockClients.find(
                            (c) => c.name === booking.clientName
                          ) || null,
                        serviceType: booking.type,
                        date: booking.date,
                        startTime: booking.time,
                        // Populate other fields from booking as needed
                        status: booking.status,
                        frequency: booking.frequency,
                        volunteer:
                          mockVolunteers.find(
                            (v) => v.name === booking.volunteer
                          ) || null,
                      });
                      setOpenNewBooking(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedBooking(booking);
                      setOpenCancelDialog(true);
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton onClick={() => replicateBooking(booking)}>
                    <ReplicateIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New/Edit Booking Dialog */}
      <Dialog
        open={openNewBooking}
        onClose={() => {
          setOpenNewBooking(false);
          setSelectedBooking(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedBooking ? "Edit Booking" : "Create New Booking"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleBookingSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Booking ID"
                  name="bookingId"
                  value={newBookingForm.bookingId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                  disabled={!!selectedBooking} // Disable if editing
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={mockClients}
                  getOptionLabel={(option) => option.name}
                  value={newBookingForm.client}
                  onChange={(event, newValue) =>
                    handleAutocompleteChange(
                      newValue,
                      setNewBookingForm,
                      "client"
                    )
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Client" required />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={mockClients.filter(
                    (c) => c.id !== newBookingForm.client?.id
                  )}
                  getOptionLabel={(option) => option.name}
                  value={newBookingForm.additionalClients}
                  onChange={(event, newValue) =>
                    handleAutocompleteChange(
                      newValue,
                      setNewBookingForm,
                      "additionalClients"
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Additional Clients (Optional)"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Booking Type</InputLabel>
                  <Select
                    name="bookingType"
                    value={newBookingForm.bookingType}
                    label="Booking Type"
                    onChange={(e) =>
                      handleInputChange(e, setNewBookingForm, "newBookingForm")
                    }
                  >
                    <MenuItem value="services">Service</MenuItem>
                    <MenuItem value="programs">Program</MenuItem>
                    <MenuItem value="supportServices">Support Service</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Service/Program Type</InputLabel>
                  <Select
                    name="serviceType"
                    value={newBookingForm.serviceType}
                    label="Service/Program Type"
                    onChange={(e) =>
                      handleInputChange(e, setNewBookingForm, "newBookingForm")
                    }
                  >
                    {renderBookingTypeOptions()}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={newBookingForm.date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  name="startTime"
                  value={newBookingForm.startTime}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Appointment Time (Optional)"
                  type="time"
                  name="appointmentTime"
                  value={newBookingForm.appointmentTime}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Length (hours)"
                  name="appointmentLength"
                  type="number"
                  value={newBookingForm.appointmentLength}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Duration (hours)"
                  name="fullDuration"
                  type="number"
                  value={newBookingForm.fullDuration}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Pickup Address
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Address Description"
                  name="pickupAddress.description"
                  value={newBookingForm.pickupAddress.description}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const { name, value } = e.target;
                    setNewBookingForm((prev) => ({
                      ...prev,
                      pickupAddress: {
                        ...prev.pickupAddress,
                        description: value,
                      },
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Street"
                  name="pickupAddress.street"
                  value={newBookingForm.pickupAddress.street}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const { name, value } = e.target;
                    setNewBookingForm((prev) => ({
                      ...prev,
                      pickupAddress: { ...prev.pickupAddress, street: value },
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="City"
                  name="pickupAddress.city"
                  value={newBookingForm.pickupAddress.city}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const { name, value } = e.target;
                    setNewBookingForm((prev) => ({
                      ...prev,
                      pickupAddress: { ...prev.pickupAddress, city: value },
                    }));
                  }}
                />
              </Grid>

              {needsDestinationAddress(newBookingForm.serviceType) && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Destination Address
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Address Description"
                      name="destinationAddress.description"
                      value={newBookingForm.destinationAddress.description}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const { name, value } = e.target;
                        setNewBookingForm((prev) => ({
                          ...prev,
                          destinationAddress: {
                            ...prev.destinationAddress,
                            description: value,
                          },
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Street"
                      name="destinationAddress.street"
                      value={newBookingForm.destinationAddress.street}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const { name, value } = e.target;
                        setNewBookingForm((prev) => ({
                          ...prev,
                          destinationAddress: {
                            ...prev.destinationAddress,
                            street: value,
                          },
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="City"
                      name="destinationAddress.city"
                      value={newBookingForm.destinationAddress.city}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const { name, value } = e.target;
                        setNewBookingForm((prev) => ({
                          ...prev,
                          destinationAddress: {
                            ...prev.destinationAddress,
                            city: value,
                          },
                        }));
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Internal)"
                  name="notes"
                  multiline
                  rows={3}
                  value={newBookingForm.notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    name="frequency"
                    value={newBookingForm.frequency}
                    label="Frequency"
                    onChange={(e) =>
                      handleInputChange(e, setNewBookingForm, "newBookingForm")
                    }
                  >
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Volunteers Needed"
                  name="volunteersNeeded"
                  type="number"
                  value={newBookingForm.volunteersNeeded}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setNewBookingForm, "newBookingForm")
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={mockVolunteers}
                  getOptionLabel={(option) =>
                    `${option.name} (${option.status})`
                  }
                  value={newBookingForm.volunteer}
                  onChange={(event, newValue) =>
                    handleAutocompleteChange(
                      newValue,
                      setNewBookingForm,
                      "volunteer"
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign Volunteer (Optional)"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={newBookingForm.status}
                    label="Status"
                    onChange={(e) =>
                      handleInputChange(e, setNewBookingForm, "newBookingForm")
                    }
                  >
                    {BOOKING_STATUSES.map((statusOpt) => (
                      <MenuItem key={statusOpt.value} value={statusOpt.value}>
                        {statusOpt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions sx={{ mt: 2, p: 0 }}>
              <Button
                onClick={() => {
                  setOpenNewBooking(false);
                  setSelectedBooking(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {selectedBooking ? "Save Changes" : "Create Booking"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Booking Dialog - Placeholder */}
      <Dialog
        open={openEventBooking}
        onClose={() => setOpenEventBooking(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Event Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Event booking form will be here. This could include selecting an
            event, date, number of attendees, etc.
          </Typography>
          {/* TODO: Implement Event Booking Form fields */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventBooking(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setOpenEventBooking(false)}
          >
            Create Event Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Booking: {selectedBooking?.id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Reason for Cancellation</InputLabel>
            <Select
              name="reason"
              value={cancelForm.reason}
              label="Reason for Cancellation"
              onChange={(e) =>
                handleInputChange(e, setCancelForm, "cancelForm")
              }
              required
            >
              {CANCEL_REASONS.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Cancellation Notes"
            name="notes"
            multiline
            rows={3}
            value={cancelForm.notes}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange(e, setCancelForm, "cancelForm")
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                name="clientConfirmation"
                checked={cancelForm.clientConfirmation}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, setCancelForm, "cancelForm")
                }
              />
            }
            label="Client Confirmed Cancellation"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>
            Keep Booking
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelBooking}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Replicate Booking Dialog */}
      <Dialog
        open={openReplicateDialog}
        onClose={() => setOpenReplicateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Replicate Booking: {selectedBooking?.id}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Replicating booking for:{" "}
            <strong>
              {selectedBooking?.clientName} - {selectedBooking?.type}
            </strong>
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="New Booking Date"
            type="date"
            name="replicationDate"
            // value={...} You'd typically have a state for this new date
            // onChange={...}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControlLabel
            control={<Checkbox /* checked={...} onChange={...} */ />}
            label="Keep same volunteer?"
          />
          {/* Add more replication options as needed (e.g., frequency, time) */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReplicateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReplicateSubmit}>
            Create Replicated Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
