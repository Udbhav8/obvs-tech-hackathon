"use client";

import React, { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  ListItemButton,
  Collapse,
} from "@mui/material";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";
import DescriptionIcon from "@mui/icons-material/Description";
import BookIcon from "@mui/icons-material/Book";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  external?: boolean;
}

interface AdminLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

export default function AdminLayout({
  children,
}: AdminLayoutProps): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ragOpen, setRagOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      text: "Docs",
      icon: <DescriptionIcon />,
      path: "https://docs.mongonext.com",
      external: true,
    },
    { text: "Bookings", icon: <CalendarTodayIcon />, path: "/admin/bookings" },
    { text: "Products", icon: <ShoppingCartIcon />, path: "/admin/products" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Blog Posts", icon: <ArticleIcon />, path: "/admin/blog" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Movies", icon: <MovieIcon />, path: "/admin/movies" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton component={Link} href="/" target="_blank">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="View Site" />
            </ListItemButton>
            {menuItems.map((item: MenuItem) => (
              <ListItemButton
                key={item.text}
                component={Link}
                href={item.path}
                target={item.external ? "_blank" : undefined}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={() => setRagOpen(!ragOpen)}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="RAG" />
              {ragOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={ragOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  href="/admin/rag-documents"
                >
                  <ListItemText primary="RAG Documents" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  href="/admin/rag-settings"
                >
                  <ListItemText primary="RAG Settings" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
