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


function VolunteerReportsPage() {
  const [newVolunteers, setNewVolunteers] = useState([]);
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    console.log("Reports page mounted");

    // ✅ CORRECTED fetch URL (matches /app/api/reports/route.ts)
    fetch("/api/reports?type=new&month=5&year=2025")
      .then(res => res.json())
      .then(data => {
        console.log("New Volunteers:", data);
        setNewVolunteers(data.message);
      })
      .catch(err => console.error("Error fetching new volunteers:", err));

    fetch("/api/reports?type=birthdays&month=5")
      .then(res => res.json())
      .then(data => {
        console.log("Birthdays:", data);
        setBirthdays(data.message);
      })
      .catch(err => console.error("Error fetching birthdays:", err));
  }, []);

  return (
    <div>
      <h1>Volunteer Reports</h1>
      <h2>New Volunteers</h2>
      <pre>{JSON.stringify(newVolunteers, null, 2)}</pre>
      <h2>Birthdays</h2>
      <pre>{JSON.stringify(birthdays, null, 2)}</pre>
    </div>
  );
}

export default VolunteerReportsPage;
