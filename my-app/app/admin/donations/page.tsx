"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Import enum types from donations-enums.ts
import {
  DonationType,
  PaymentType,
  ReceiptType,
  DonationsEnumName,
} from "@/enums/donations-enums";

// Interface for Donor Profile, matching the backend model
interface DonorProfile {
  _id: string; // Mongoose's default ID
  first_name?: string | null;
  last_name?: string | null;
  organization_name?: string | null;
  email?: string | null;
  donor_type: string;
  // Add other fields from IDonorProfile if needed for display
}

// Interface for Donation, matching the backend model
interface Donation {
  _id: string; // Mongoose's default ID for donation
  donor_id: DonorProfile; // Populated donor profile
  donation_amount: number;
  eligible_amount: number;
  value_advantage: number;
  donation_type: DonationType;
  payment_type: PaymentType;
  receipt_type: ReceiptType;
  received_date: string; // Dates will be strings from backend, convert for display
  processed_date: string;
  deposit_date: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// Type for enum values from API
type EnumValues = {
  [K in DonationsEnumName]: string[];
};

// Type for select option configuration
interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

export default function DonationsPage() {
  const [showNewDonation, setShowNewDonation] = useState(false);
  const [activeTab, setActiveTab] = useState<DonationType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<
    PaymentType | "all"
  >("all");
  const [receivedDateRange, setReceivedDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [processedDateRange, setProcessedDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [depositDateRange, setDepositDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showFilters, setShowFilters] = useState(false);

  // State for enum values from API
  const [enumValues, setEnumValues] = useState<EnumValues | null>(null);
  const [enumsLoading, setEnumsLoading] = useState(true);
  const [enumsError, setEnumsError] = useState<string | null>(null);

  // State for new donation form
  const [newDonationData, setNewDonationData] = useState({
    donation_type: DonationType.PERSONAL, // Default to Personal
    donor_name: "",
    donation_amount: 0,
    eligible_amount: 0,
    value_advantage: 0,
    payment_type: PaymentType.CHEQUE, // Default to Cheque
    receipt_type: ReceiptType.REQUIRED, // Default to Required
    received_date: new Date(),
    processed_date: new Date(),
    deposit_date: new Date(),
  });

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDonorPrompt, setShowDonorPrompt] = useState(false); // State for donor prompt dialog

  // Helper function to get donation type colors - moved before useMemo hooks
  const getDonationTypeColor = (type: DonationType): string => {
    switch (type) {
      case DonationType.PERSONAL:
        return "bg-blue-100 text-blue-800";
      case DonationType.CORPORATE:
        return "bg-green-100 text-green-800";
      case DonationType.GRANT:
        return "bg-orange-100 text-orange-800";
      case DonationType.BEQUEATHED:
        return "bg-purple-100 text-purple-800";
      case DonationType.OTHER:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fetch enum values from API
  const fetchEnumValues = useCallback(async () => {
    setEnumsLoading(true);
    setEnumsError(null);
    try {
      const response = await fetch("/api/donations/enums");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: EnumValues = await response.json();
      setEnumValues(data);
    } catch (err) {
      console.error("Error fetching enum values:", err);
      setEnumsError("Failed to load enum values. Using defaults.");
      // Fallback to local enum values
      setEnumValues({
        DonationType: Object.values(DonationType),
        PaymentType: Object.values(PaymentType),
        ReceiptType: Object.values(ReceiptType),
        ReceiptSentMethod: [], // Not used in this component
        ReceiptStatus: [], // Not used in this component
        DonorType: [], // Not used in this component
      });
    } finally {
      setEnumsLoading(false);
    }
  }, []);

  // Create select options from enum values
  const donationTypeOptions: SelectOption[] = useMemo(() => {
    if (!enumValues?.DonationType) return [];
    return enumValues.DonationType.map((value) => ({
      value,
      label: value,
      color: getDonationTypeColor(value as DonationType),
    }));
  }, [enumValues]);

  const paymentTypeOptions: SelectOption[] = useMemo(() => {
    if (!enumValues?.PaymentType) return [];
    return enumValues.PaymentType.map((value) => ({
      value,
      label: value,
    }));
  }, [enumValues]);

  const receiptTypeOptions: SelectOption[] = useMemo(() => {
    if (!enumValues?.ReceiptType) return [];
    return enumValues.ReceiptType.map((value) => ({
      value,
      label: value,
    }));
  }, [enumValues]);

  // Auto-populate eligible_amount and value_advantage
  useEffect(() => {
    setNewDonationData((prev) => ({
      ...prev,
      eligible_amount: prev.donation_amount,
      value_advantage: 0,
    }));
  }, [newDonationData.donation_amount]);

  // Keyboard shortcut for new donation (Ctrl+N or Cmd+N)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        setShowNewDonation(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch enum values on component mount
  useEffect(() => {
    fetchEnumValues();
  }, [fetchEnumValues]);

  // Fetch donations from the backend
  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append("donorName", searchTerm);
      }
      // Add date range filters if implemented in backend
      // if (receivedDateRange.from) queryParams.append('receivedFrom', receivedDateRange.from.toISOString());
      // if (receivedDateRange.to) queryParams.append('receivedTo', receivedDateRange.to.toISOString());

      const response = await fetch(`/api/donations?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Donation[] = await response.json();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Failed to load donations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]); // Re-fetch when searchTerm changes

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const getCategoryBadge = (type: DonationType) => {
    const color = getDonationTypeColor(type);
    return <Badge className={color}>{type}</Badge>;
  };

  const handleNewDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewDonationData((prev) => ({
      ...prev,
      [id]:
        id === "donation_amount" ||
        id === "eligible_amount" ||
        id === "value_advantage"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setNewDonationData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (id: string, date: Date | undefined) => {
    if (date) {
      setNewDonationData((prev) => ({
        ...prev,
        [id]: date,
      }));
    }
  };

  const handleSaveDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Basic validation
    if (!newDonationData.donor_name || newDonationData.donation_amount <= 0) {
      setError("Donor name and donation amount are required.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newDonationData,
          // Ensure dates are sent as ISO strings
          received_date: newDonationData.received_date.toISOString(),
          processed_date: newDonationData.processed_date.toISOString(),
          deposit_date: newDonationData.deposit_date.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check for specific error message for donor not found
        if (
          errorData.message.includes("Failed to create donation") &&
          errorData.error.includes("donor_name")
        ) {
          setShowDonorPrompt(true); // Show prompt to create new user
        }
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // If successful, clear form, hide form, and re-fetch donations
      setNewDonationData({
        donation_type: DonationType.PERSONAL,
        donor_name: "",
        donation_amount: 0,
        eligible_amount: 0,
        value_advantage: 0,
        payment_type: PaymentType.CHEQUE,
        receipt_type: ReceiptType.REQUIRED,
        received_date: new Date(),
        processed_date: new Date(),
        deposit_date: new Date(),
      });
      setShowNewDonation(false);
      await fetchDonations(); // Re-fetch to show the new donation
    } catch (err) {
      console.error("Error saving donation:", err);
      setError(`Failed to save donation: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter donations based on active tab, payment type, and search term
  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesType =
        activeTab === "all" || donation.donation_type === activeTab;
      const matchesPaymentType =
        paymentTypeFilter === "all" ||
        donation.payment_type === paymentTypeFilter;
      const matchesSearchTerm =
        searchTerm === "" ||
        (donation.donor_id?.first_name &&
          donation.donor_id.first_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (donation.donor_id?.last_name &&
          donation.donor_id.last_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (donation.donor_id?.organization_name &&
          donation.donor_id.organization_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      // Date range filtering (client-side for now, can be moved to backend)
      const receivedDate = new Date(donation.received_date);
      const processedDate = new Date(donation.processed_date);
      const depositDate = new Date(donation.deposit_date);

      const matchesReceivedDate =
        (!receivedDateRange.from || receivedDate >= receivedDateRange.from) &&
        (!receivedDateRange.to || receivedDate <= receivedDateRange.to);
      const matchesProcessedDate =
        (!processedDateRange.from ||
          processedDate >= processedDateRange.from) &&
        (!processedDateRange.to || processedDate <= processedDateRange.to);
      const matchesDepositDate =
        (!depositDateRange.from || depositDate >= depositDateRange.from) &&
        (!depositDateRange.to || depositDate <= depositDateRange.to);

      return (
        matchesType &&
        matchesPaymentType &&
        matchesSearchTerm &&
        matchesReceivedDate &&
        matchesProcessedDate &&
        matchesDepositDate
      );
    });
  }, [
    donations,
    activeTab,
    paymentTypeFilter,
    searchTerm,
    receivedDateRange,
    processedDateRange,
    depositDateRange,
  ]);

  // Show loading state while enums are being fetched
  if (enumsLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6 font-inter">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading donations page...</div>
            <div className="text-sm text-muted-foreground mt-2">
              Fetching enum values...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 font-inter">
      {" "}
      {/* Applied font-inter */}
      {enumsError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="text-yellow-800 text-sm">{enumsError}</div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Donations</h1>
        <Button onClick={() => setShowNewDonation(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Donation
        </Button>
      </div>
      <Card className="rounded-lg shadow-md">
        {" "}
        {/* Added rounded-lg and shadow-md */}
        <CardHeader>
          <CardTitle>Donation Management</CardTitle>
          <CardDescription>
            View and manage donations by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search donations by donor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm rounded-md" // Added rounded-md
              />
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-md"
              >
                {" "}
                {/* Added rounded-md */}
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                {" "}
                {/* Responsive grid, rounded-lg, bg-gray-50 */}
                <div className="space-y-2">
                  <Label htmlFor="paymentTypeFilter">Payment Type</Label>
                  <Select
                    value={paymentTypeFilter}
                    onValueChange={(value) =>
                      setPaymentTypeFilter(value as PaymentType | "all")
                    }
                  >
                    <SelectTrigger
                      id="paymentTypeFilter"
                      className="rounded-md"
                    >
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {paymentTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Received Date Range</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {" "}
                    {/* Responsive flex */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-md"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {receivedDateRange.from
                            ? format(receivedDateRange.from, "PPP")
                            : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-md">
                        <Calendar
                          mode="single"
                          selected={receivedDateRange.from}
                          onSelect={(date) =>
                            setReceivedDateRange({
                              ...receivedDateRange,
                              from: date,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-md"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {receivedDateRange.to
                            ? format(receivedDateRange.to, "PPP")
                            : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-md">
                        <Calendar
                          mode="single"
                          selected={receivedDateRange.to}
                          onSelect={(date) =>
                            setReceivedDateRange({
                              ...receivedDateRange,
                              to: date,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Processed Date Range</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-md"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {processedDateRange.from
                            ? format(processedDateRange.from, "PPP")
                            : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-md">
                        <Calendar
                          mode="single"
                          selected={processedDateRange.from}
                          onSelect={(date) =>
                            setProcessedDateRange({
                              ...processedDateRange,
                              from: date,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-md"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {processedDateRange.to
                            ? format(processedDateRange.to, "PPP")
                            : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-md">
                        <Calendar
                          mode="single"
                          selected={processedDateRange.to}
                          onSelect={(date) =>
                            setProcessedDateRange({
                              ...processedDateRange,
                              to: date,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deposit Date Range</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-md"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {depositDateRange.from
                            ? format(depositDateRange.from, "PPP")
                            : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-md">
                        <Calendar
                          mode="single"
                          selected={depositDateRange.from}
                          onSelect={(date) =>
                            setDepositDateRange({
                              ...depositDateRange,
                              from: date,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-md"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {depositDateRange.to
                            ? format(depositDateRange.to, "PPP")
                            : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-md">
                        <Calendar
                          mode="single"
                          selected={depositDateRange.to}
                          onSelect={(date) =>
                            setDepositDateRange({
                              ...depositDateRange,
                              to: date,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as DonationType | "all")
              }
            >
              <TabsList className="grid w-full grid-cols-6 rounded-md">
                <TabsTrigger value="all">All</TabsTrigger>
                {donationTypeOptions.map((type) => (
                  <TabsTrigger key={type.value} value={type.value}>
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="rounded-md border overflow-x-auto">
                  {" "}
                  {/* Added overflow-x-auto for responsiveness */}
                  {loading ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Loading donations...
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">Donor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Payment Type</TableHead>
                          <TableHead className="min-w-[140px]">
                            Received Date
                          </TableHead>
                          <TableHead className="min-w-[140px]">
                            Processed Date
                          </TableHead>
                          <TableHead className="min-w-[140px]">
                            Deposit Date
                          </TableHead>
                          <TableHead>Receipt Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDonations.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No donations found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDonations.map((donation) => (
                            <TableRow key={donation._id}>
                              <TableCell>
                                {donation.donor_id?.organization_name ||
                                  `${donation.donor_id?.first_name || ""} ${donation.donor_id?.last_name || ""}`.trim() ||
                                  "N/A"}
                              </TableCell>
                              <TableCell>
                                ${donation.donation_amount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {getCategoryBadge(donation.donation_type)}
                              </TableCell>
                              <TableCell>{donation.payment_type}</TableCell>
                              <TableCell>
                                {format(
                                  new Date(donation.received_date),
                                  "PPP"
                                )}
                              </TableCell>
                              <TableCell>
                                {format(
                                  new Date(donation.processed_date),
                                  "PPP"
                                )}
                              </TableCell>
                              <TableCell>
                                {format(new Date(donation.deposit_date), "PPP")}
                              </TableCell>
                              <TableCell>{donation.receipt_type}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      {showNewDonation && (
        <Card className="rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>New Donation</CardTitle>
            <CardDescription>Enter donation details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSaveDonation}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                {/* Responsive grid */}
                <div className="space-y-2">
                  <Label htmlFor="donation_type">Donation Type</Label>
                  <Select
                    value={newDonationData.donation_type}
                    onValueChange={(value: DonationType) =>
                      handleSelectChange("donation_type", value)
                    }
                  >
                    <SelectTrigger id="donation_type" className="rounded-md">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {donationTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor_name">Donor Name</Label>
                  <Input
                    id="donor_name"
                    placeholder="Enter donor name"
                    value={newDonationData.donor_name}
                    onChange={handleNewDonationChange}
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donation_amount">Donation Amount</Label>
                  <Input
                    id="donation_amount"
                    type="number"
                    placeholder="0.00"
                    value={
                      newDonationData.donation_amount === 0
                        ? ""
                        : newDonationData.donation_amount
                    }
                    onChange={handleNewDonationChange}
                    step="0.01"
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligible_amount">Eligible Amount</Label>
                  <Input
                    id="eligible_amount"
                    type="number"
                    placeholder="0.00"
                    value={
                      newDonationData.eligible_amount === 0
                        ? ""
                        : newDonationData.eligible_amount
                    }
                    onChange={handleNewDonationChange}
                    step="0.01"
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value_advantage">Value Advantage</Label>
                  <Input
                    id="value_advantage"
                    type="number"
                    placeholder="0.00"
                    value={
                      newDonationData.value_advantage === 0
                        ? ""
                        : newDonationData.value_advantage
                    }
                    onChange={handleNewDonationChange}
                    step="0.01"
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_type">Payment Type</Label>
                  <Select
                    value={newDonationData.payment_type}
                    onValueChange={(value: PaymentType) =>
                      handleSelectChange("payment_type", value)
                    }
                  >
                    <SelectTrigger id="payment_type" className="rounded-md">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt_type">Receipt Type</Label>
                  <Select
                    value={newDonationData.receipt_type}
                    onValueChange={(value: ReceiptType) =>
                      handleSelectChange("receipt_type", value)
                    }
                  >
                    <SelectTrigger id="receipt_type" className="rounded-md">
                      <SelectValue placeholder="Select receipt type" />
                    </SelectTrigger>
                    <SelectContent>
                      {receiptTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Received Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-md",
                          !newDonationData.received_date &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDonationData.received_date
                          ? format(newDonationData.received_date, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-md">
                      <Calendar
                        mode="single"
                        selected={newDonationData.received_date}
                        onSelect={(date) =>
                          handleDateChange("received_date", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Processed Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-md",
                          !newDonationData.processed_date &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDonationData.processed_date
                          ? format(newDonationData.processed_date, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-md">
                      <Calendar
                        mode="single"
                        selected={newDonationData.processed_date}
                        onSelect={(date) =>
                          handleDateChange("processed_date", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Deposit Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-md",
                          !newDonationData.deposit_date &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDonationData.deposit_date
                          ? format(newDonationData.deposit_date, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-md">
                      <Calendar
                        mode="single"
                        selected={newDonationData.deposit_date}
                        onSelect={(date) =>
                          handleDateChange("deposit_date", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewDonation(false)}
                  type="button"
                  className="rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md"
                >
                  {isSaving ? "Saving..." : "Save Donation"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {/* Donor Prompt Dialog */}
      <Dialog open={showDonorPrompt} onOpenChange={setShowDonorPrompt}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle>Donor Not Found</DialogTitle>
            <DialogDescription>
              The donor &ldquo;{newDonationData.donor_name}&rdquo; was not found
              in the database. Would you like to create a new donor profile for
              this name?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDonorPrompt(false)}
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setShowDonorPrompt(false);
                // Re-attempt save, backend will now create the donor
                await handleSaveDonation(
                  new Event("submit") as unknown as React.FormEvent
                );
              }}
              className="rounded-md"
            >
              Create Donor & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
