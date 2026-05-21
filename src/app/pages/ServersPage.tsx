import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddOutlined from "@mui/icons-material/AddOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import DatabaseOutlined from "@mui/icons-material/StorageOutlined";
import WifiOutlined from "@mui/icons-material/WifiOutlined";
import WifiOffOutlined from "@mui/icons-material/WifiOffOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { NewServerModal } from "../components/NewServerModal";
import { ServerSettingsModal, type ServerData, type ServerSettingsTab } from "../components/ServerSettingsModal";

const INITIAL_SERVERS: ServerData[] = [
  { id: "s1", name: "Mario-Alpha", game: "Mario", online: true, testers: 12, dataTypes: 8, lastActive: "2 min ago", region: "EU West" },
  { id: "s2", name: "WiscoElysium-Beta", game: "Wisco Elysium", online: true, testers: 5, dataTypes: 5, lastActive: "14 min ago", region: "US East" },
  { id: "s3", name: "TotalFantasyGame-QA", game: "Total Fantasy Game", online: false, testers: 23, dataTypes: 11, lastActive: "3 days ago", region: "EU Central" },
  { id: "s4", name: "TetrisGame-Test", game: "Tetris Adventure", online: true, testers: 8, dataTypes: 4, lastActive: "1 hr ago", region: "US West" },
];

export function ServersPage() {
  const [servers, setServers] = useState<ServerData[]>(INITIAL_SERVERS);
  const [newOpen, setNewOpen] = useState(false);
  const [settingsServer, setSettingsServer] = useState<ServerData | null>(null);
  const [settingsTab, setSettingsTab] = useState<ServerSettingsTab>("overview");

  const openSettings = (server: ServerData, initialTab: ServerSettingsTab = "overview") => {
    setSettingsServer(server);
    setSettingsTab(initialTab);
  };

  const handleCreate = (name: string, game: string, region: string) => {
    const regions: Record<string, string> = {
      "eu-west": "EU West", "eu-central": "EU Central",
      "us-east": "US East", "us-west": "US West", "ap-south": "AP South",
    };
    setServers((prev) => [...prev, {
      id: `s${Date.now()}`, name, game, online: false,
      testers: 0, dataTypes: 0, lastActive: "Just created", region: regions[region] ?? region,
    }]);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Servers</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage data collection servers · {servers.filter((s) => s.online).length} online, {servers.filter((s) => !s.online).length} offline
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setNewOpen(true)}>
          New Server
        </Button>
      </Box>

      <Grid container spacing={2}>
        {servers.map((server) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={server.id}>
            <ServerCard server={server} onSettings={openSettings} />
          </Grid>
        ))}
      </Grid>

      <NewServerModal open={newOpen} onClose={() => setNewOpen(false)} onCreate={handleCreate} />
      {settingsServer && (
        <ServerSettingsModal server={settingsServer} initialTab={settingsTab} onClose={() => setSettingsServer(null)} />
      )}
    </Box>
  );
}

function ServerCard({ server, onSettings }: { server: ServerData; onSettings: (server: ServerData, initialTab?: ServerSettingsTab) => void }) {
  return (
    <Card elevation={0} sx={{ height: "100%", "&:hover": { borderColor: "rgba(99,102,241,0.3)" }, transition: "border-color 0.2s" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: server.online ? "rgba(16,185,129,0.1)" : "rgba(139,143,168,0.08)", color: server.online ? "#10b981" : "#8b8fa8" }}>
              <StorageOutlined fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{server.name}</Typography>
              <Typography variant="caption" color="text.secondary">{server.game}</Typography>
            </Box>
          </Box>
          <Tooltip title="Server Settings">
            <IconButton size="small" onClick={() => onSettings(server)} sx={{ color: "text.secondary" }}>
              <SettingsOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Status row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            icon={server.online ? <WifiOutlined sx={{ fontSize: "0.9rem !important" }} /> : <WifiOffOutlined sx={{ fontSize: "0.9rem !important" }} />}
            label={server.online ? "Online" : "Offline"}
            size="small"
            sx={{ bgcolor: server.online ? "rgba(16,185,129,0.1)" : "rgba(139,143,168,0.08)", color: server.online ? "#10b981" : "#8b8fa8", fontSize: "0.72rem", height: 22 }}
          />
          <Typography variant="caption" color="text.secondary">{server.region}</Typography>
          <FiberManualRecordIcon sx={{ fontSize: 4, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">Active {server.lastActive}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => onSettings(server, "testers")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              minWidth: 0,
              p: 0,
              color: "text.secondary",
              textTransform: "none",
              justifyContent: "flex-start",
              "&:hover": { bgcolor: "transparent", color: "text.primary" },
            }}
          >
            <PeopleOutlined sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">{server.testers} testers</Typography>
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => onSettings(server, "data")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              minWidth: 0,
              p: 0,
              color: "text.secondary",
              textTransform: "none",
              justifyContent: "flex-start",
              "&:hover": { bgcolor: "transparent", color: "text.primary" },
            }}
          >
            <DatabaseOutlined sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">{server.dataTypes} data types</Typography>
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}