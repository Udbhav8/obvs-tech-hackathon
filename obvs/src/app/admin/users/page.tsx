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
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";

interface UserCategory {
  value: string;
  label: string;
  color: string;
}

const USER_CATEGORIES: UserCategory[] = [
  { value: "clients", label: "Clients", color: "#1976d2" },
  { value: "volunteers", label: "Volunteers", color: "#388e3c" },
  { value: "donors", label: "Donors", color: "#f57c00" },
  { value: "helping-hearts", label: "Helping Hearts", color: "#e91e63" },
  { value: "staff", label: "Staff", color: "#7b1fa2" },
  { value: "board", label: "Board", color: "#d32f2f" },
];

interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  category: string;
  position?: string;
  dateJoined?: string | Date;
  role?: string;
  // Add any other fields that your user object might have
}

interface FormData {
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  category: string;
  position: string;
  dateJoined: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export default function UsersPage(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    category: "clients",
    position: "",
    dateJoined: new Date().toISOString().split("T")[0],
  });
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsersByCategory();
  }, [users, activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setSnackbar({
        open: true,
        message: "Failed to fetch users.",
        severity: "error",
      });
    }
  };

  const filterUsersByCategory = () => {
    if (USER_CATEGORIES[activeTab]) {
      const currentCategory = USER_CATEGORIES[activeTab].value;
      const filtered = users.filter(
        (user) => user.category === currentCategory
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Or handle as an error/default case
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpen = (user: User | null = null) => {
    const defaultCategory = USER_CATEGORIES[activeTab]?.value || "clients";
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't pre-fill password for security
        phone: user.phone || "",
        address: user.address || "",
        category: user.category || defaultCategory,
        position: user.position || "",
        dateJoined: user.dateJoined
          ? new Date(user.dateJoined).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        category: defaultCategory,
        position: "",
        dateJoined: new Date().toISOString().split("T")[0],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    // Reset form to default including category from active tab
    const defaultCategory = USER_CATEGORIES[activeTab]?.value || "clients";
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      category: defaultCategory,
      position: "",
      dateJoined: new Date().toISOString().split("T")[0],
    });
  };

  const handleProfileOpen = (user: User) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = editingUser ? `/api/users?id=${editingUser._id}` : "/api/users";
    const method = editingUser ? "PUT" : "POST";

    let body: Partial<FormData> = { ...formData }; // Use Partial if password is not always sent
    if (editingUser && !formData.password) {
      // Only delete password if editing and it's empty
      body = { ...formData };
      delete body.password;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchUsers();
        handleClose();
        setSnackbar({
          open: true,
          message: editingUser
            ? "User updated successfully!"
            : "User added successfully!",
          severity: "success",
        });
      } else {
        const errorData = await res.json();
        setSnackbar({
          open: true,
          message: errorData.error || "Failed to save user.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchUsers();
          setSnackbar({
            open: true,
            message: "User deleted successfully!",
            severity: "success",
          });
        } else {
          const errorData = await res.json();
          setSnackbar({
            open: true,
            message: errorData.error || "Failed to delete user.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setSnackbar({
          open: true,
          message: "An error occurred. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const getUserCategoryLabel = (categoryValue: string): string => {
    const cat = USER_CATEGORIES.find((c) => c.value === categoryValue);
    return cat ? cat.label : categoryValue;
  };

  const getUserCategoryColor = (categoryValue: string): string => {
    const cat = USER_CATEGORIES.find((c) => c.value === categoryValue);
    return cat ? cat.color : "#1976d2"; // Default color
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen(null)}
        >
          Add New User
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {USER_CATEGORIES.map((category, index) => (
          <Tab label={category.label} key={index} />
        ))}
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell
                  onClick={() => handleProfileOpen(user)}
                  sx={{ cursor: "pointer" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        mr: 1,
                        bgcolor: getUserCategoryColor(user.category),
                        width: 32,
                        height: 32,
                        fontSize: "0.875rem",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={getUserCategoryLabel(user.category)}
                    size="small"
                    sx={{
                      backgroundColor: getUserCategoryColor(user.category),
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              label={editingUser ? "New Password (optional)" : "Password"}
              type="password"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!editingUser}
            />
            <TextField
              margin="dense"
              label="Phone"
              type="tel"
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Address"
              type="text"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                {USER_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Position/Role (e.g., Manager, Volunteer Coordinator)"
              type="text"
              fullWidth
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Date Joined"
              type="date"
              fullWidth
              name="dateJoined"
              value={formData.dateJoined}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* User Profile View Dialog */}
      <Dialog
        open={profileOpen}
        onClose={handleProfileClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Profile</DialogTitle>
        {selectedUser && (
          <DialogContent>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 2,
                      bgcolor: getUserCategoryColor(selectedUser.category),
                    }}
                  >
                    <Typography variant="h3">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </Typography>
                  </Avatar>
                  <Box>
                    <Typography variant="h5">{selectedUser.name}</Typography>
                    <Chip
                      label={getUserCategoryLabel(selectedUser.category)}
                      size="small"
                      sx={{
                        bgcolor: getUserCategoryColor(selectedUser.category),
                        color: "white",
                      }}
                    />
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={selectedUser.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={selectedUser.phone || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={selectedUser.address || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Position"
                      secondary={selectedUser.position || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date Joined"
                      secondary={
                        selectedUser.dateJoined
                          ? new Date(
                              selectedUser.dateJoined
                            ).toLocaleDateString()
                          : "N/A"
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Role"
                      secondary={selectedUser.role || "user"}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            onClick={() => {
              handleProfileClose();
              if (selectedUser) handleOpen(selectedUser);
            }}
          >
            Edit
          </Button>
          <Button onClick={handleProfileClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
