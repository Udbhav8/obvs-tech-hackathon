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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  category: string;
  position?: string;
  dateJoined: string;
  role?: string;
  avatar?: string;
}

interface UserCategory {
  value: string;
  label: string;
  color: string;
}

const USER_CATEGORIES: UserCategory[] = [
  { value: "clients", label: "Clients", color: "bg-blue-100 text-blue-800" },
  {
    value: "volunteers",
    label: "Volunteers",
    color: "bg-green-100 text-green-800",
  },
  { value: "donors", label: "Donors", color: "bg-orange-100 text-orange-800" },
  {
    value: "helping-hearts",
    label: "Helping Hearts",
    color: "bg-pink-100 text-pink-800",
  },
  { value: "staff", label: "Staff", color: "bg-purple-100 text-purple-800" },
  { value: "board", label: "Board", color: "bg-red-100 text-red-800" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "clients",
    position: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, activeTab, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main St, City, State",
          category: "clients",
          dateJoined: "2024-01-15",
          role: "Client",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 (555) 987-6543",
          address: "456 Oak Ave, City, State",
          category: "volunteers",
          position: "Driver",
          dateJoined: "2024-02-20",
          role: "Volunteer",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          phone: "+1 (555) 456-7890",
          category: "donors",
          dateJoined: "2024-03-10",
          role: "Donor",
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          phone: "+1 (555) 321-0987",
          category: "staff",
          position: "Coordinator",
          dateJoined: "2024-01-05",
          role: "Staff",
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users.filter((user) => user.category === activeTab);

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = USER_CATEGORIES.find(
      (cat) => cat.value === category
    );
    return categoryConfig ? (
      <Badge className={categoryConfig.color}>{categoryConfig.label}</Badge>
    ) : (
      <Badge variant="secondary">{category}</Badge>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = {
        ...formData,
        id: editingUser?.id || Date.now().toString(),
        dateJoined:
          editingUser?.dateJoined || new Date().toISOString().split("T")[0],
        role:
          formData.category.charAt(0).toUpperCase() +
          formData.category.slice(1),
      };

      if (editingUser) {
        // Update existing user
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...userData } : user
          )
        );
      } else {
        // Add new user
        setUsers([...users, userData as User]);
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: 
      user.email,
      phone: user.phone || "",
      address: user.address || "",
      category: user.category,
      position: user.position || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      category: activeTab,
      position: "",
    });
    setEditingUser(null);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage all users in the system
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update user information"
                  : "Create a new user account"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="Optional"
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
                  {editingUser ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>View and manage users by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                {USER_CATEGORIES.map((category) => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {USER_CATEGORIES.map((category) => (
                <TabsContent key={category.value} value={category.value}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Date Joined</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No users found in this category
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {user.role}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-sm">
                                    <Mail className="h-3 w-3" />
                                    {user.email}
                                  </div>
                                  {user.phone && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Phone className="h-3 w-3" />
                                      {user.phone}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {user.position && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Briefcase className="h-3 w-3" />
                                      {user.position}
                                    </div>
                                  )}
                                  {user.address && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      {user.address}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(
                                    user.dateJoined
                                  ).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getCategoryBadge(user.category)}
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
                                      onClick={() => handleEdit(user)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => openDeleteDialog(user)}
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action
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
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
