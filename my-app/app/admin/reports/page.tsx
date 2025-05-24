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

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);

  // Filters state for NEW VOLUNTEERS tab
  const [selectedMonth, setSelectedMonth] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [newVolunteers, setNewVolunteers] = useState([]);

  const [selectedBirthdayMonth, setSelectedBirthdayMonth] = useState("");
  const [birthdayPeople, setBirthdayPeople] = useState([]);


  const handleTabClick = (label) => {
    setActiveTab(label);
    setActiveSubTab(null); // reset sub-tab on main tab switch
  };

  const handleSubTabClick = (label) => {
    setActiveSubTab(label);
  };

  const mainButtons = ["BOOKINGS", "EVENTS", "VOLUNTEERS", "CLIENTS", "DONORS"];
  const volunteerSubButtons = ["NEW VOLUNTEERS", "ACTIVE SERVICES", "BIRTHDAYS"];

  // Fetch new volunteers based on filters
  const fetchNewVolunteers = () => {
    if (!selectedMonth || !yearInput) {
      alert("Please select both month and year");
      return;
    }
    fetch(`/api/reports?type=new&month=${parseInt(selectedMonth)}&year=${yearInput}`)
      .then((res) => res.json())
      .then((data) => {
        setNewVolunteers(data.message || []);
      })
      .catch((err) => {
        console.error("Error fetching new volunteers:", err);
        setNewVolunteers([]);
      });
  };

  // Fetch new birthdays based on filters
  const fetchBirthdays = () => {
  if (!selectedBirthdayMonth) {
    alert("Please select a month");
    return;
  }
  fetch(`/api/reports?type=birthdays&month=${parseInt(selectedBirthdayMonth)}`)
    .then((res) => res.json())
    .then((data) => {
      setBirthdayPeople(data.message || []);
    })
    .catch((err) => {
      console.error("Error fetching birthdays:", err);
      setBirthdayPeople([]);
    });
};


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">REPORTS</h1>
          <p className="text-muted-foreground">Manage and view existing reports</p>
        </div>
      </div>

      {/* Main Buttons */}
      <div className="flex space-x-4">
        {mainButtons.map((label) => (
          <button
            key={label}
            className={`flex-1 border border-gray-300 py-3 rounded-md transition
              ${
                activeTab === label
                  ? "bg-[#0891B2] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            onClick={() => handleTabClick(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sub-Buttons for Volunteers */}
      {activeTab === "VOLUNTEERS" && (
        <div className="flex space-x-4">
          {volunteerSubButtons.map((label) => (
            <button
              key={label}
              className={`flex-1 border border-gray-300 py-3 rounded-md transition
                ${
                  activeSubTab === label
                    ? "bg-[#0891B2] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => handleSubTabClick(label)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Content Box for NEW VOLUNTEERS */}
      {activeSubTab === "NEW VOLUNTEERS" && (
        <div className="border border-gray-300 rounded-md p-4 space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            {/* Month Dropdown */}
            <div className="flex-1">
              <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0");
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Year Textbox */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter year"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Sort Button */}
            <div className="flex-1">
              <Button
                variant="outline"
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={fetchNewVolunteers}
              >
                Sort
              </Button>
            </div>
          </div>

          {/* Table */}
          {newVolunteers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newVolunteers.map((person, index) => (
                  <TableRow key={index}>
                    <TableCell>{person.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-sm">No results yet.</p>
          )}
        </div>
      )}

      {/* Content Box for BIRTHDAYS */}
{activeSubTab === "BIRTHDAYS" && (
  <div className="border border-gray-300 rounded-md p-4 space-y-4">
    {/* Filters */}
    <div className="flex gap-4 w-full">
      {/* Month Dropdown */}
      <Select onValueChange={setSelectedBirthdayMonth} value={selectedBirthdayMonth}>
        <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, "0");
            return (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Sort Button */}
      <Button
        variant="outline"
        className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100"
        onClick={fetchBirthdays}
      >
        Sort
      </Button>
    </div>

    {/* Table */}
    {birthdayPeople.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {birthdayPeople.map((person, index) => (
            <TableRow key={index}>
              <TableCell>{person.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <p className="text-gray-500 text-sm">No results yet.</p>
    )}
  </div>
)}


{/* Content Box for ACTIVE SERVICES */}

{!activeTab && (
  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
    <Search className="w-10 h-10 mb-4" />
    <p className="text-lg">Click on a report type you would like to view</p>
  </div>
)}

    </div>
  );
}
