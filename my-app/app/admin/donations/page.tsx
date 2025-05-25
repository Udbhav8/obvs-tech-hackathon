"use client";

import { useState } from "react";
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

type DonationType = "Personal" | "Corporate" | "Grant" | "Bequeathed" | "Other";
type PaymentType = "Cheque" | "Cash" | "Third Party" | "Direct Debit" | "Other";
type ReceiptType = "Required" | "Sent via CanadaHelps" | "Not Needed";

interface Donation {
    id: string;
    donor: string;
    amount: number;
    type: DonationType;
    paymentType: PaymentType;
    receiptType: ReceiptType;
    receivedDate: Date;
    processedDate: Date;
    depositDate: Date;
    eligibleAmount: number;
    valueAdvantage: number;
}

const DONATION_TYPES: { value: DonationType; label: string; color: string }[] = [
    { value: "Personal", label: "Personal", color: "bg-blue-100 text-blue-800" },
    { value: "Corporate", label: "Corporate", color: "bg-green-100 text-green-800" },
    { value: "Grant", label: "Grant", color: "bg-orange-100 text-orange-800" },
    { value: "Bequeathed", label: "Bequeathed", color: "bg-purple-100 text-purple-800" },
    { value: "Other", label: "Other", color: "bg-gray-100 text-gray-800" },
];

export default function DonationsPage() {
    const [showNewDonation, setShowNewDonation] = useState(false);
    const [activeTab, setActiveTab] = useState<DonationType | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentTypeFilter, setPaymentTypeFilter] = useState<PaymentType | "all">("all");
    const [receivedDateRange, setReceivedDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
    const [processedDateRange, setProcessedDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
    const [depositDateRange, setDepositDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
    const [showFilters, setShowFilters] = useState(false);

    // Mock data - replace with actual data fetching
    const [donations] = useState<Donation[]>([
        {
            id: "1",
            donor: "John Doe",
            amount: 1000,
            type: "Personal",
            paymentType: "Cash",
            receiptType: "Required",
            receivedDate: new Date("2024-01-15"),
            processedDate: new Date("2024-01-16"),
            depositDate: new Date("2024-01-17"),
            eligibleAmount: 1000,
            valueAdvantage: 0,
        },
        // Add more mock donations as needed
    ]);

    const getCategoryBadge = (type: DonationType) => {
        const categoryConfig = DONATION_TYPES.find((cat) => cat.value === type);
        return categoryConfig ? (
            <Badge className={categoryConfig.color}>{categoryConfig.label}</Badge>
        ) : (
            <Badge variant="secondary">{type}</Badge>
        );
    };

    const filteredDonations = donations.filter((donation) => {
        if (activeTab !== "all" && donation.type !== activeTab) return false;
        if (paymentTypeFilter !== "all" && donation.paymentType !== paymentTypeFilter) return false;
        if (searchTerm && !donation.donor.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        // Add date range filtering logic here
        return true;
    });

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Donations</h1>
                <Button onClick={() => setShowNewDonation(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Donation
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Donation Management</CardTitle>
                    <CardDescription>View and manage donations by category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search donations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                                <div className="space-y-2">
                                    <Label>Payment Type</Label>
                                    <Select
                                        value={paymentTypeFilter}
                                        onValueChange={(value) => setPaymentTypeFilter(value as PaymentType | "all")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Third Party">Third Party</SelectItem>
                                            <SelectItem value="Direct Debit">Direct Debit</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Received Date Range</Label>
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {receivedDateRange.from ? format(receivedDateRange.from, "PPP") : "From"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={receivedDateRange.from}
                                                    onSelect={(date) => setReceivedDateRange({ ...receivedDateRange, from: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {receivedDateRange.to ? format(receivedDateRange.to, "PPP") : "To"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={receivedDateRange.to}
                                                    onSelect={(date) => setReceivedDateRange({ ...receivedDateRange, to: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Processed Date Range</Label>
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {processedDateRange.from ? format(processedDateRange.from, "PPP") : "From"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={processedDateRange.from}
                                                    onSelect={(date) => setProcessedDateRange({ ...processedDateRange, from: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {processedDateRange.to ? format(processedDateRange.to, "PPP") : "To"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={processedDateRange.to}
                                                    onSelect={(date) => setProcessedDateRange({ ...processedDateRange, to: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Deposit Date Range</Label>
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {depositDateRange.from ? format(depositDateRange.from, "PPP") : "From"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={depositDateRange.from}
                                                    onSelect={(date) => setDepositDateRange({ ...depositDateRange, from: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {depositDateRange.to ? format(depositDateRange.to, "PPP") : "To"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={depositDateRange.to}
                                                    onSelect={(date) => setDepositDateRange({ ...depositDateRange, to: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DonationType | "all")}>
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="all">All</TabsTrigger>
                                {DONATION_TYPES.map((type) => (
                                    <TabsTrigger key={type.value} value={type.value}>
                                        {type.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value={activeTab}>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Donor</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Payment Type</TableHead>
                                                <TableHead>Received Date</TableHead>
                                                <TableHead>Processed Date</TableHead>
                                                <TableHead>Deposit Date</TableHead>
                                                <TableHead>Receipt Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredDonations.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                        No donations found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredDonations.map((donation) => (
                                                    <TableRow key={donation.id}>
                                                        <TableCell>{donation.donor}</TableCell>
                                                        <TableCell>${donation.amount.toFixed(2)}</TableCell>
                                                        <TableCell>{getCategoryBadge(donation.type)}</TableCell>
                                                        <TableCell>{donation.paymentType}</TableCell>
                                                        <TableCell>{format(donation.receivedDate, "PPP")}</TableCell>
                                                        <TableCell>{format(donation.processedDate, "PPP")}</TableCell>
                                                        <TableCell>{format(donation.depositDate, "PPP")}</TableCell>
                                                        <TableCell>{donation.receiptType}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            {showNewDonation && (
                <Card>
                    <CardHeader>
                        <CardTitle>New Donation</CardTitle>
                        <CardDescription>Enter donation details below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="donationType">Donation Type</Label>
                                    <Select
                                        value={activeTab}
                                        onValueChange={(value) => setActiveTab(value as DonationType | "all")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            {DONATION_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="donor">Donor</Label>
                                    <Input id="donor" placeholder="Enter donor name" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="donationAmount">Donation Amount</Label>
                                    <Input
                                        id="donationAmount"
                                        type="number"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eligibleAmount">Eligible Amount</Label>
                                    <Input
                                        id="eligibleAmount"
                                        type="number"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="valueAdvantage">Value Advantage</Label>
                                    <Input
                                        id="valueAdvantage"
                                        type="number"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paymentType">Payment Type</Label>
                                    <Select
                                        value={paymentTypeFilter}
                                        onValueChange={(value) => setPaymentTypeFilter(value as PaymentType | "all")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Third Party">Third Party</SelectItem>
                                            <SelectItem value="Direct Debit">Direct Debit</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="receiptType">Receipt Type</Label>
                                    <Select
                                        value="Required"
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select receipt type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Required">Required</SelectItem>
                                            <SelectItem value="Sent via CanadaHelps">Sent via CanadaHelps</SelectItem>
                                            <SelectItem value="Not Needed">Not Needed</SelectItem>
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
                                                    "w-full justify-start text-left font-normal",
                                                    !receivedDateRange.from && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {receivedDateRange.from ? format(receivedDateRange.from, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={receivedDateRange.from}
                                                onSelect={(date) => setReceivedDateRange({ ...receivedDateRange, from: date })}
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
                                                    "w-full justify-start text-left font-normal",
                                                    !processedDateRange.from && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {processedDateRange.from ? format(processedDateRange.from, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={processedDateRange.from}
                                                onSelect={(date) => setProcessedDateRange({ ...processedDateRange, from: date })}
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
                                                    "w-full justify-start text-left font-normal",
                                                    !depositDateRange.from && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {depositDateRange.from ? format(depositDateRange.from, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={depositDateRange.from}
                                                onSelect={(date) => setDepositDateRange({ ...depositDateRange, from: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" onClick={() => setShowNewDonation(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Donation</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
