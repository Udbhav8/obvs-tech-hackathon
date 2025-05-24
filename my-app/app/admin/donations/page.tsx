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
import { CalendarIcon, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type DonationType = "Personal" | "Corporate" | "Grant" | "Bequeathed" | "Other";
type PaymentType = "Cheque" | "Cash" | "Third Party" | "Direct Debit" | "Other";
type ReceiptType = "Required" | "Sent via CanadaHelps" | "Not Needed";

export default function DonationsPage() {
    const [showNewDonation, setShowNewDonation] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [donationType, setDonationType] = useState<DonationType>("Personal");
    const [paymentType, setPaymentType] = useState<PaymentType>("Cash");
    const [receiptType, setReceiptType] = useState<ReceiptType>("Required");
    const [donationAmount, setDonationAmount] = useState("");
    const [eligibleAmount, setEligibleAmount] = useState("");
    const [valueAdvantage, setValueAdvantage] = useState("0.00");

    const handleDonationAmountChange = (value: string) => {
        setDonationAmount(value);
        setEligibleAmount(value); // Auto-populate eligible amount
    };

    const handleNewDonation = () => {
        setShowNewDonation(true);
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Donations</h1>
                <Button onClick={handleNewDonation}>
                    <Plus className="mr-2 h-4 w-4" /> New Donation
                </Button>
            </div>

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
                                        value={donationType}
                                        onValueChange={(value) => setDonationType(value as DonationType)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Personal">Personal</SelectItem>
                                            <SelectItem value="Corporate">Corporate</SelectItem>
                                            <SelectItem value="Grant">Grant</SelectItem>
                                            <SelectItem value="Bequeathed">Bequeathed</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
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
                                        value={donationAmount}
                                        onChange={(e) => handleDonationAmountChange(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eligibleAmount">Eligible Amount</Label>
                                    <Input
                                        id="eligibleAmount"
                                        type="number"
                                        value={eligibleAmount}
                                        onChange={(e) => setEligibleAmount(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="valueAdvantage">Value Advantage</Label>
                                    <Input
                                        id="valueAdvantage"
                                        type="number"
                                        value={valueAdvantage}
                                        onChange={(e) => setValueAdvantage(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paymentType">Payment Type</Label>
                                    <Select
                                        value={paymentType}
                                        onValueChange={(value) => setPaymentType(value as PaymentType)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                        value={receiptType}
                                        onValueChange={(value) => setReceiptType(value as ReceiptType)}
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
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(date) => date && setDate(date)}
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
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(date) => date && setDate(date)}
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
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(date) => date && setDate(date)}
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

            <Card>
                <CardHeader>
                    <CardTitle>Donation Search</CardTitle>
                    <CardDescription>Search and filter donations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        <Input placeholder="Search donations..." />
                        <Button>
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
