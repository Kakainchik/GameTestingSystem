import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import LoginOutlined from "@mui/icons-material/LoginOutlined";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import Badge from "@mui/material/Badge";

type User = { name: string; email: string; studio: string; initials: string } | null;

const MOCK_USER: User = {
  name: "Mikhail S",
  email: "admin@shadowstudio.dev",
  studio: "Interfaces Studio",
  initials: "MS",
};

export function UserMenu() {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSignOut = () => { setUser(null); handleClose(); };
  const handleSignIn = () => setUser(MOCK_USER);

  if (!user) {
    return (
      <Button variant="contained" size="small" startIcon={<LoginOutlined />} onClick={handleSignIn} sx={{ borderRadius: 2 }}>
        Sign In
      </Button>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <IconButton
        size="small"
        onClick={(e) => setNotifAnchor(e.currentTarget)}
        sx={{ color: "text.secondary" }}
      >
        <Badge badgeContent={3} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", minWidth: 16, height: 16 } }}>
          <NotificationsOutlined fontSize="small" />
        </Badge>
      </IconButton>

      <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)} PaperProps={{ sx: { width: 300, mt: 1 } }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <Typography variant="subtitle2">Notifications</Typography>
        </Box>
        <Divider />
        {[
          { text: "Mario-Alpha has 3 new issues", time: "5 min ago", dot: "error.main" },
          { text: "SpeedRunner42 completed 5 sessions", time: "1 hr ago", dot: "success.main" },
          { text: "Server TotalFantasyGame-QA went offline", time: "3 hrs ago", dot: "warning.main" },
        ].map((n, i) => (
          <MenuItem key={i} onClick={() => setNotifAnchor(null)} sx={{ alignItems: "flex-start", gap: 1.5, py: 1.5 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: n.dot, mt: 0.8, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2">{n.text}</Typography>
              <Typography variant="caption" color="text.secondary">{n.time}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      <Button
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownOutlined fontSize="small" />}
        sx={{ borderRadius: 2, px: 1, gap: 1, color: "text.primary", textTransform: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
      >
        <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.dark", fontSize: "0.72rem", fontWeight: 700 }}>
          {user.initials}
        </Avatar>
        <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
          <Typography variant="body2" sx={{ lineHeight: 1.2, fontWeight: 600 }}>{user.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{user.studio}</Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 220, mt: 1 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <Typography variant="subtitle2">{user.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleClose} sx={{ gap: 1, py: 1 }}>
          <ListItemIcon><AccountCircleOutlined fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ gap: 1, py: 1 }}>
          <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
          Account Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} sx={{ gap: 1, py: 1, color: "error.main" }}>
          <ListItemIcon><LogoutOutlined fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
