import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import ExtensionOutlined from "@mui/icons-material/ExtensionOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import { UserMenu } from "./UserMenu";

const DRAWER_WIDTH = 220;

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: <DashboardOutlined fontSize="small" />, exact: true },
  { to: "/servers", label: "Servers", icon: <StorageOutlined fontSize="small" /> },
  { to: "/data", label: "Collected Data", icon: <BarChartOutlined fontSize="small" /> },
  { to: "/docs", label: "API Documentation", icon: <MenuBookOutlined fontSize="small" /> },
  { to: "/plugin-setup", label: "Plugin Setup", icon: <ExtensionOutlined fontSize="small" /> },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <Box sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldOutlined sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1, color: "text.primary" }}>
            GameMetrics
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>QA Platform</Typography>
        </Box>
      </Box>

      <Divider />

      {/* Nav */}
      <Box sx={{ px: 1, pt: 1.5, flex: 1 }}>
        <Typography variant="caption" sx={{ px: 1.5, pb: 1, display: "block", color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
          Workspace
        </Typography>
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          {NAV_ITEMS.map(({ to, label, icon, exact }) => {
            const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <ListItemButton
                key={to}
                component={NavLink}
                to={to}
                onClick={onNav}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 0.9,
                  px: 1.5,
                  gap: 0,
                  color: isActive ? "primary.light" : "text.secondary",
                  bgcolor: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                  "&:hover": { bgcolor: isActive ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)", color: "text.primary" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>{icon}</ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ variant: "body2", fontWeight: isActive ? 600 : 400 }} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />
      {/* Studio info */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: "rgba(99,102,241,0.2)", color: "primary.light", fontSize: "0.7rem", fontWeight: 700 }}>ST</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>Interfaces Studio</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip label="Free" size="small" sx={{ height: 16, fontSize: "0.65rem", bgcolor: "rgba(255,255,255,0.06)", color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">4 servers</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle = NAV_ITEMS.find((n) =>
    n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)
  )?.label ?? "GameMetrics";

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ gap: 2, minHeight: "52px !important" }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" }, color: "text.secondary" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, flex: 1 }}>
              {pageTitle}
            </Typography>
            <UserMenu />
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, overflow: "auto", bgcolor: "background.default" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
