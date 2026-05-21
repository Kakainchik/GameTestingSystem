import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import DatabaseOutlined from "@mui/icons-material/StorageOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import VpnKeyOutlined from "@mui/icons-material/VpnKeyOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import TagOutlined from "@mui/icons-material/TagOutlined";
import ToggleOnOutlined from "@mui/icons-material/ToggleOnOutlined";
import NotesOutlined from "@mui/icons-material/NotesOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import TimerOutlined from "@mui/icons-material/TimerOutlined";
import EventOutlined from "@mui/icons-material/EventOutlined";
import DataObjectOutlined from "@mui/icons-material/DataObjectOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";

export type ServerData = {
  id: string; name: string; game: string; online: boolean;
  testers: number; dataTypes: number; lastActive: string; region: string;
};

export type ServerSettingsTab = "overview" | "data" | "testers";

type Tab = ServerSettingsTab;

const DATA_TYPES = [
  { id: "integer", icon: <TagOutlined fontSize="small" />, label: "Integer", desc: "Whole number (score, kills, level)", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { id: "float", icon: <DataObjectOutlined fontSize="small" />, label: "Float", desc: "Decimal (position, time elapsed)", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  { id: "boolean", icon: <ToggleOnOutlined fontSize="small" />, label: "Boolean", desc: "True/false (quest done, died)", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { id: "string", icon: <NotesOutlined fontSize="small" />, label: "String", desc: "Text (player name, item selected)", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { id: "vector", icon: <LocationOnOutlined fontSize="small" />, label: "Vector2/3", desc: "Coordinates or direction", color: "#f43f5e", bg: "rgba(244,63,94,0.12)" },
  { id: "event", icon: <EventOutlined fontSize="small" />, label: "Event", desc: "Timestamped action (press, death)", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
];

type ConfiguredItem = { id: string; name: string; typeId: string; createdAt: string };
const INITIAL_DATA: ConfiguredItem[] = [
  { id: "d1", name: "Player Health", typeId: "integer", createdAt: "2026-04-10" },
  { id: "d2", name: "Number of offensive cards", typeId: "integer", createdAt: "2026-04-10" },
  { id: "d3", name: "Position on death", typeId: "vector", createdAt: "2026-04-12" },
  { id: "d4", name: "Chest opened", typeId: "event", createdAt: "2026-04-15" },
  { id: "d5", name: "Difficulty selected", typeId: "string", createdAt: "2026-04-15" },
  { id: "d6", name: "Run completed", typeId: "boolean", createdAt: "2026-04-18" },
  { id: "d7", name: "Time per floor", typeId: "float", createdAt: "2026-04-20" },
  { id: "d8", name: "Cards played", typeId: "integer", createdAt: "2026-04-22" },
];

type Tester = { id: string; nickname: string; email: string; sessions: number; lastSeen: string };
const INITIAL_TESTERS: Tester[] = [
  { id: "t1", nickname: "ShaderMagician", email: "magical.matrix@testmail.com", sessions: 14, lastSeen: "Today" },
  { id: "t2", nickname: "Franzyd", email: "f.firek@qa-team.com", sessions: 9, lastSeen: "Yesterday" },
  { id: "t3", nickname: "Kakainchik", email: "m.shestayev@testmail.com", sessions: 22, lastSeen: "2 days ago" },
  { id: "t4", nickname: "Zevli", email: "pr-hr.@studio.dev", sessions: 6, lastSeen: "5 days ago" },
  { id: "t5", nickname: "SpeedDesigner", email: "oleg.olegov@testmail.com", sessions: 31, lastSeen: "Today" },
  { id: "t6", nickname: "xXxDestroyerxXx", email: "thebestmail@qa-team.com", sessions: 18, lastSeen: "3 days ago" },
];

function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return "gm_live_" + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function ServerSettingsModal({ server, onClose, initialTab = "overview" }: { server: ServerData; onClose: () => void; initialTab?: ServerSettingsTab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleObtainKey = () => setApiKey(generateKey());
  const handleRegenerateKey = () => { setApiKey(generateKey()); setCopied(false); };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: 3, maxHeight: "88vh" } }}>
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 3, py: 2 }}>
          {tab !== "overview" && (
            <IconButton size="small" onClick={() => setTab("overview")} sx={{ mr: 0.5 }}>
              <ArrowBackOutlined fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{server.name}</Typography>
            <Typography variant="caption" color="text.secondary">Server Settings</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              size="small"
              label={server.online ? "Online" : "Offline"}
              sx={{ bgcolor: server.online ? "rgba(16,185,129,0.1)" : "rgba(139,143,168,0.1)", color: server.online ? "#10b981" : "#8b8fa8", fontSize: "0.72rem" }}
            />
            <IconButton onClick={onClose} size="small"><CloseOutlined fontSize="small" /></IconButton>
          </Box>
        </Box>
        <Divider />
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {tab === "overview" && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {[
                { label: "Region", value: server.region },
                { label: "Game", value: server.game },
                { label: "Active Testers", value: String(server.testers) },
                { label: "Data Types", value: String(server.dataTypes) },
              ].map((item) => (
                <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25 }}>{item.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* API Key Section */}
            <Box sx={{ p: 2, borderRadius: 2, border: "1px solid rgba(99,102,241,0.2)", bgcolor: "rgba(99,102,241,0.05)", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <VpnKeyOutlined sx={{ fontSize: 18, color: "primary.light" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Server API Key</Typography>
                </Box>
                {apiKey ? (
                  <Button size="small" startIcon={<RefreshOutlined fontSize="small" />} onClick={handleRegenerateKey} color="warning" variant="text" sx={{ fontSize: "0.78rem" }}>
                    Regenerate
                  </Button>
                ) : (
                  <Button size="small" startIcon={<VpnKeyOutlined fontSize="small" />} onClick={handleObtainKey} variant="contained" sx={{ fontSize: "0.78rem" }}>
                    Obtain API Key
                  </Button>
                )}
              </Box>
              {apiKey ? (
                <TextField
                  value={apiKey}
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: { fontFamily: "monospace", fontSize: "0.8rem", bgcolor: "rgba(0,0,0,0.3)" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={copied ? "Copied!" : "Copy key"}>
                          <IconButton size="small" onClick={handleCopy} edge="end">
                            {copied ? <CheckOutlined fontSize="small" sx={{ color: "success.main" }} /> : <ContentCopyOutlined fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Click <strong style={{ color: "#818cf8" }}>Obtain API Key</strong> to generate a key for connecting your game SDK to this server.
                </Typography>
              )}
              {apiKey && (
                <Alert severity="warning" sx={{ mt: 1.5, py: 0.5, fontSize: "0.78rem" }}>
                  Store this key securely. It grants full access to this server's data endpoints.
                </Alert>
              )}
            </Box>

            {/* Configuration Menu */}
            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, display: "block", mb: 1 }}>
              Configuration
            </Typography>
            {[
              { id: "data" as Tab, icon: <DatabaseOutlined />, color: "rgba(139,92,246,0.12)", iconColor: "#8b5cf6", title: "Data and Event Configuration", desc: "Define what data is collected, its type and label" },
              { id: "testers" as Tab, icon: <PeopleOutlined />, color: "rgba(56,189,248,0.12)", iconColor: "#38bdf8", title: "Tester Configuration", desc: "Manage registered testers and their session data" },
            ].map((item) => (
              <Box
                key={item.id}
                onClick={() => setTab(item.id)}
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 2, cursor: "pointer", mb: 1, border: "1px solid rgba(255,255,255,0.04)", "&:hover": { bgcolor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }, transition: "all 0.15s" }}
              >
                <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: item.color, color: item.iconColor }}>{item.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                </Box>
                <ChevronRightOutlined sx={{ color: "text.secondary", fontSize: 18 }} />
              </Box>
            ))}
          </Box>
        )}

        {tab === "data" && <DataConfigPanel />}
        {tab === "testers" && <TesterConfigPanel />}
      </DialogContent>
    </Dialog>
  );
}

function DataConfigPanel() {
  const [items, setItems] = useState<ConfiguredItem[]>(INITIAL_DATA);
  const [adding, setAdding] = useState(false);
  const [step, setStep] = useState<"type" | "name">("type");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const getType = (id: string) => DATA_TYPES.find((t) => t.id === id);

  const handleAdd = () => {
    if (!selectedType || !newName.trim()) return;
    setItems((p) => [...p, { id: `d${Date.now()}`, name: newName.trim(), typeId: selectedType, createdAt: new Date().toISOString().slice(0, 10) }]);
    setAdding(false); setSelectedType(null); setNewName(""); setStep("type");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Data & Event Configuration</Typography>
          <Typography variant="body2" color="text.secondary">{items.length} data types configured</Typography>
        </Box>
        <Button startIcon={<AddOutlined />} variant="contained" size="small" onClick={() => { setAdding(true); setStep("type"); }}>
          Add Data Type
        </Button>
      </Box>

      <Collapse in={adding}>
        <Box sx={{ p: 2.5, borderRadius: 2, border: "1px solid rgba(99,102,241,0.3)", bgcolor: "rgba(99,102,241,0.05)", mb: 2.5 }}>
          {step === "type" ? (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Step 1 — Select a type</Typography>
              <Grid container spacing={1}>
                {DATA_TYPES.map((dt) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={dt.id}>
                    <Box
                      onClick={() => { setSelectedType(dt.id); setStep("name"); }}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, border: `1px solid ${selectedType === dt.id ? dt.color : "rgba(255,255,255,0.06)"}`, cursor: "pointer", "&:hover": { borderColor: dt.color, bgcolor: dt.bg }, transition: "all 0.15s" }}
                    >
                      <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: dt.bg, color: dt.color }}>{dt.icon}</Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{dt.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{dt.desc}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button size="small" onClick={() => setAdding(false)} sx={{ mt: 1.5 }} color="inherit">Cancel</Button>
            </>
          ) : (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Step 2 — Name this data point</Typography>
              {selectedType && (() => { const t = getType(selectedType)!; return (
                <Chip icon={<Box sx={{ color: `${t.color} !important`, display: "flex" }}>{t.icon}</Box>} label={t.label} size="small" sx={{ mb: 1.5, bgcolor: t.bg, color: t.color, border: `1px solid ${t.color}40` }} />
              ); })()}
              <TextField
                autoFocus fullWidth label="Data point name" value={newName} onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="e.g. Number of offensive cards" sx={{ mb: 1.5 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" onClick={() => setStep("type")} color="inherit" variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.1)" }}>Back</Button>
                <Button size="small" onClick={handleAdd} variant="contained" disabled={!newName.trim()}>Add</Button>
              </Box>
            </>
          )}
        </Box>
      </Collapse>

      <List disablePadding>
        {items.map((item, i) => {
          const t = getType(item.typeId);
          return (
            <Box key={item.id}>
              {i > 0 && <Divider />}
              <ListItem sx={{ px: 1, py: 1 }} secondaryAction={
                <IconButton edge="end" size="small" onClick={() => setItems((p) => p.filter((x) => x.id !== item.id))} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                  <DeleteOutlineOutlined fontSize="small" />
                </IconButton>
              }>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {t && <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: t.bg, color: t.color }}>{t.icon}</Box>}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={`${t?.label} · Added ${item.createdAt}`}
                  primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}

function TesterConfigPanel() {
  const [testers, setTesters] = useState<Tester[]>(INITIAL_TESTERS);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = testers.filter(
    (t) => t.nickname.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Tester Configuration</Typography>
        <Typography variant="body2" color="text.secondary">{testers.length} testers registered</Typography>
      </Box>

      <TextField
        fullWidth value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by nickname or email..."
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" sx={{ color: "text.secondary" }} /></InputAdornment> }}
        sx={{ mb: 2 }}
      />

      {filtered.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>No testers match your search.</Typography>
      )}

      <List disablePadding>
        {filtered.map((tester, i) => (
          <Box key={tester.id}>
            {i > 0 && <Divider />}
            <ListItem sx={{ px: 1, py: 1.25 }} secondaryAction={
              <Button size="small" startIcon={<DeleteOutlineOutlined fontSize="small" />} color="error" variant="text" sx={{ fontSize: "0.78rem" }} onClick={() => setConfirmId(tester.id)}>
                Delete
              </Button>
            }>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: "rgba(99,102,241,0.15)", color: "primary.light", fontSize: "0.7rem", fontWeight: 700 }}>
                  {tester.nickname.slice(0, 2).toUpperCase()}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={tester.nickname}
                secondary={<>{tester.email} · {tester.sessions} sessions · Last: {tester.lastSeen}</>}
                primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>

            <Collapse in={confirmId === tester.id}>
              <Alert
                severity="error"
                sx={{ mx: 1, mb: 1, fontSize: "0.82rem" }}
                action={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" color="error" variant="contained" onClick={() => { setTesters((p) => p.filter((t) => t.id !== tester.id)); setConfirmId(null); }}>
                      Delete all data
                    </Button>
                    <Button size="small" color="inherit" onClick={() => setConfirmId(null)}>Cancel</Button>
                  </Box>
                }
              >
                Delete <strong>{tester.nickname}</strong> and all their session data? This cannot be undone.
              </Alert>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
}
