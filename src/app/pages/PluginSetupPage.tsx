import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AddOutlined from "@mui/icons-material/AddOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import ExtensionOutlined from "@mui/icons-material/ExtensionOutlined";
import VpnKeyOutlined from "@mui/icons-material/VpnKeyOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import CloudDownloadOutlined from "@mui/icons-material/CloudDownloadOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";

type ApiKey = {
  id: string; name: string; key: string; created: string;
  lastUsed: string | null; server: string; active: boolean;
};

function generateKey() {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return "gm_live_" + Array.from({ length: 40 }, () => c[Math.floor(Math.random() * c.length)]).join("");
}

const INITIAL_KEYS: ApiKey[] = [
  { id: "k1", name: "Mario Production", key: generateKey(), created: "2026-04-10", lastUsed: "2026-05-16", server: "Mario-Alpha", active: true },
  { id: "k2", name: "WiscoElysium Beta", key: generateKey(), created: "2026-04-22", lastUsed: "2026-05-15", server: "WiscoElysium-Beta", active: true },
  { id: "k3", name: "Legacy Test Key", key: generateKey(), created: "2026-03-01", lastUsed: "2026-03-28", server: "TotalFantasyGame-QA", active: false },
];

const ENGINES = [
  { id: "unity", label: "Unity", logo: "U#", color: "#1a1a1a" },
  { id: "unreal", label: "Unreal Engine", logo: "UE", color: "#1b3a5e" },
  { id: "godot", label: "Godot", logo: "G4", color: "#1a2d1a" },
];

const INTEGRATION_CODE: Record<string, { install: string; init: string; event: string; metric: string }> = {
  unity: {
    install: `# Via Unity Package Manager (UPM)
# Add the following to your Packages/manifest.json:

{
  "dependencies": {
    "io.gamemetrics.sdk": "https://github.com/gamemetrics/unity-sdk.git#v1.2.0"
  }
}`,
    init: `using GameMetrics;

public class GameManager : MonoBehaviour
{
    void Awake()
    {
        GameMetricsSDK.Initialize(new SDKConfig
        {
            ServerUrl = "https://api.gamemetrics.io",
            ApiKey    = "gm_live_YOUR_API_KEY",
            ServerId  = "srv_Mario-Alpha"
        });
    }

    void OnLevelLoaded(string levelName)
    {
        GameMetricsSDK.StartSession(new SessionOptions
        {
            TesterId = PlayerPrefs.GetString("tester_email"),
            Level    = levelName,
            Build    = Application.version
        });
    }
}`,
    event: `// Record a discrete event
GameMetricsSDK.RecordEvent("player_died", new Dictionary<string, object>
{
    { "position",  new Vector3(245f, 0f, -88.3f) },
    { "cause",     "trap_spike" },
    { "health",    player.Health }
});`,
    metric: `// Record a metric value
GameMetricsSDK.RecordMetric("number_of_offensive_cards", hand.OffensiveCount);
GameMetricsSDK.RecordMetric("player_health", player.Health);`,
  },
  unreal: {
    install: `# Add to your project's .uproject plugins array:

{
  "Name": "GameMetricsSDK",
  "Enabled": true,
  "MarketplaceURL": "https://marketplace.unrealengine.com/gamemetrics"
}

# Or clone manually into Plugins/GameMetricsSDK`,
    init: `// In your GameInstance or GameMode BeginPlay:

#include "GameMetricsSubsystem.h"

void AMyGameMode::BeginPlay()
{
    Super::BeginPlay();

    UGameMetricsSubsystem* GM = GetGameInstance()
        ->GetSubsystem<UGameMetricsSubsystem>();

    GM->Initialize(
        TEXT("https://api.gamemetrics.io"),
        TEXT("gm_live_YOUR_API_KEY"),
        TEXT("srv_Mario-Alpha")
    );
    GM->StartSession(PlayerEmail, LevelName, GameVersion);
}`,
    event: `// Record a discrete event
TMap<FString, FString> Payload;
Payload.Add(TEXT("position"), FString::Printf(
    TEXT("%f,%f,%f"), Pos.X, Pos.Y, Pos.Z));
Payload.Add(TEXT("cause"), TEXT("trap_spike"));

GM->RecordEvent(TEXT("player_died"), Payload);`,
    metric: `// Record a metric value
GM->RecordMetric(TEXT("number_of_offensive_cards"),
    FString::FromInt(Hand->GetOffensiveCount()));`,
  },
  godot: {
    install: `# Via Godot Asset Library or manually:
# Copy the addons/gamemetrics/ folder into your project.
# Enable in Project → Project Settings → Plugins → GameMetrics SDK`,
    init: `# In your autoload script (GameManager.gd):
extends Node

func _ready():
    GameMetrics.initialize({
        "server_url": "https://api.gamemetrics.io",
        "api_key": "gm_live_YOUR_API_KEY",
        "server_id": "srv_Mario-Alpha"
    })

func on_level_loaded(level_name: String):
    GameMetrics.start_session({
        "tester_id": Settings.tester_email,
        "level": level_name,
        "build": ProjectSettings.get("application/config/version")
    })`,
    event: `# Record a discrete event
GameMetrics.record_event("player_died", {
    "position": { "x": 245.0, "y": 0.0, "z": -88.3 },
    "cause": "trap_spike",
    "health": player.health
})`,
    metric: `# Record a metric value
GameMetrics.record_metric("number_of_offensive_cards", hand.get_offensive_count())
GameMetrics.record_metric("player_health", player.health)`,
  },
};

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Box sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 0.75, bgcolor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Typography variant="caption" sx={{ color: "#8b8fa8", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{language}</Typography>
        <IconButton size="small" onClick={handleCopy} sx={{ color: "text.secondary" }}>
          {copied ? <CheckOutlined sx={{ fontSize: 14, color: "success.main" }} /> : <ContentCopyOutlined sx={{ fontSize: 14 }} />}
        </IconButton>
      </Box>
      <Box component="pre" sx={{ m: 0, p: 2, bgcolor: "#0a0b14", overflowX: "auto", fontSize: "0.82rem", lineHeight: 1.7, fontFamily: '"Fira Code", "Fira Mono", monospace', color: "#c9d1d9" }}>
        <code>{code}</code>
      </Box>
    </Box>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab() {
  const steps = [
    { n: "1", title: "Create a Server", desc: "Set up a data collection server in the Servers section and obtain its API key." },
    { n: "2", title: "Install the SDK Plugin", desc: "Download and install the GameMetrics SDK plugin for Unity, Unreal, or Godot." },
    { n: "3", title: "Initialize in Your Game", desc: "Initialize the SDK with your server URL and API key in your game's startup code." },
    { n: "4", title: "Record Data", desc: "Call RecordEvent() and RecordMetric() wherever meaningful actions happen." },
    { n: "5", title: "View & Analyze", desc: "Go to Collected Data in the dashboard to explore aggregated charts and statistics." },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(99,102,241,0.12)", color: "primary.light" }}>
          <ExtensionOutlined fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Plugin Setup</Typography>
          <Typography variant="body2" color="text.secondary">
            Integrate GameMetrics into your game in minutes — no external programs required on the tester's side.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Supported Engines", value: "Unity · Unreal · Godot", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
          { label: "Tester Setup Required", value: "None", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { label: "Latest SDK Version", value: "v1.2.0", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
          { label: "Protocol", value: "HTTPS / REST", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
        ].map((item) => (
          <Grid size={{ xs: 6, md: 3 }} key={item.label}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: item.bg, border: `1px solid ${item.color}30` }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>{item.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: item.color }}>{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Integration Flow</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
        {steps.map((step) => (
          <Box key={step.n} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "rgba(99,102,241,0.15)", border: "1.5px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Typography variant="caption" sx={{ color: "primary.light", fontWeight: 700 }}>{step.n}</Typography>
            </Box>
            <Box sx={{ pt: 0.25 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{step.title}</Typography>
              <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Paper sx={{ p: 2, bgcolor: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <SportsEsportsOutlined sx={{ color: "primary.light", mt: 0.25 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Transparency Note</Typography>
            <Typography variant="body2" color="text.secondary">
              GameMetrics runs in the background during gameplay. To comply with data transparency requirements, inform testers about what data is being collected before each session. You can view all configured data types in Server Settings → Data & Event Configuration.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// ── Installation Tab ──────────────────────────────────────────────────────────
function InstallationTab() {
  const [engine, setEngine] = useState("unity");
  const code = INTEGRATION_CODE[engine];

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>SDK Installation & Integration</Typography>

      {/* Engine selector */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {ENGINES.map((e) => (
          <Button
            key={e.id}
            variant={engine === e.id ? "contained" : "outlined"}
            size="small"
            startIcon={
              <Box sx={{ width: 20, height: 20, borderRadius: 0.75, bgcolor: e.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#fff" }}>
                {e.logo}
              </Box>
            }
            onClick={() => setEngine(e.id)}
            sx={{ borderColor: engine === e.id ? "primary.main" : "rgba(255,255,255,0.1)", borderRadius: 2 }}
          >
            {e.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[
          { title: "1. Install the SDK", code: code.install, lang: "Shell" },
          { title: "2. Initialize the SDK", code: code.init, lang: engine === "unity" ? "C#" : engine === "unreal" ? "C++" : "GDScript" },
          { title: "3. Record Events", code: code.event, lang: engine === "unity" ? "C#" : engine === "unreal" ? "C++" : "GDScript" },
          { title: "4. Record Metrics", code: code.metric, lang: engine === "unity" ? "C#" : engine === "unreal" ? "C++" : "GDScript" },
        ].map(({ title, code, lang }) => (
          <Box key={title}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
            <CodeBlock code={code} language={lang} />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Button variant="outlined" size="small" startIcon={<CloudDownloadOutlined />} sx={{ borderColor: "rgba(255,255,255,0.1)" }}>
          Download SDK Package
        </Button>
        <Button variant="outlined" size="small" startIcon={<CheckCircleOutlineOutlined />} sx={{ borderColor: "rgba(255,255,255,0.1)" }}>
          View Changelog
        </Button>
      </Box>
    </Box>
  );
}

// ── API Keys Tab ──────────────────────────────────────────────────────────────
function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newServer, setNewServer] = useState("Mario-Alpha");
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);

  const toggleVisible = (id: string) => setVisibleIds((p) => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    setKeys((p) => [...p, { id: `k${Date.now()}`, name: newName.trim(), key: generateKey(), created: new Date().toISOString().slice(0, 10), lastUsed: null, server: newServer, active: true }]);
    setNewOpen(false);
    setNewName("");
  };

  const handleRevoke = (id: string) => {
    setKeys((p) => p.map((k) => k.id === id ? { ...k, active: false } : k));
    setRevokeId(null);
  };

  const maskKey = (key: string) => key.slice(0, 12) + "•".repeat(20) + key.slice(-6);

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>API Key Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all server API keys across your projects
          </Typography>
        </Box>
        <Button variant="contained" size="small" startIcon={<AddOutlined />} onClick={() => setNewOpen(true)}>
          Create Key
        </Button>
      </Box>

      <Alert severity="warning" sx={{ mb: 3, fontSize: "0.82rem" }}>
        API keys grant full access to server endpoints. Never commit keys to version control. Revoke unused keys immediately.
      </Alert>

      <Box sx={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Server</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Used</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((k) => (
              <TableRow key={k.id} sx={{ "&:last-child td": { border: 0 }, opacity: k.active ? 1 : 0.5 }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <VpnKeyOutlined sx={{ fontSize: 14, color: k.active ? "primary.light" : "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{k.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {visibleIds.has(k.id) ? k.key : maskKey(k.key)}
                    </Typography>
                    <IconButton size="small" onClick={() => toggleVisible(k.id)} sx={{ p: 0.25, color: "text.secondary" }}>
                      {visibleIds.has(k.id) ? <VisibilityOffOutlined sx={{ fontSize: 13 }} /> : <VisibilityOutlined sx={{ fontSize: 13 }} />}
                    </IconButton>
                    <Tooltip title={copiedId === k.id ? "Copied!" : "Copy"}>
                      <IconButton size="small" onClick={() => handleCopy(k.id, k.key)} sx={{ p: 0.25, color: "text.secondary" }}>
                        {copiedId === k.id ? <CheckOutlined sx={{ fontSize: 13, color: "success.main" }} /> : <ContentCopyOutlined sx={{ fontSize: 13 }} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{k.server}</Typography></TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{k.created}</Typography></TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{k.lastUsed ?? "Never"}</Typography></TableCell>
                <TableCell>
                  <Chip
                    label={k.active ? "Active" : "Revoked"}
                    size="small"
                    sx={{ height: 18, fontSize: "0.65rem", bgcolor: k.active ? "rgba(16,185,129,0.1)" : "rgba(139,143,168,0.1)", color: k.active ? "#10b981" : "#8b8fa8" }}
                  />
                </TableCell>
                <TableCell align="right">
                  {k.active && (
                    <Tooltip title="Revoke Key">
                      <IconButton size="small" onClick={() => setRevokeId(k.id)} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                        <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Revoke confirm */}
      {revokeId && (
        <Alert
          severity="error"
          sx={{ mt: 2, fontSize: "0.82rem" }}
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button size="small" color="error" variant="contained" onClick={() => handleRevoke(revokeId)}>Revoke</Button>
              <Button size="small" color="inherit" onClick={() => setRevokeId(null)}>Cancel</Button>
            </Box>
          }
        >
          Revoking this key will immediately break any game connections using it. Continue?
        </Alert>
      )}

      {/* Create key dialog */}
      <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create API Key</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
            <TextField label="Key Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Mario Staging" fullWidth />
            <TextField label="Server" value={newServer} onChange={(e) => setNewServer(e.target.value)} fullWidth select SelectProps={{ native: true }}>
              {["Mario-Alpha", "WiscoElysium-Beta", "TotalFantasyGame-QA", "TetrisGame-Test"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setNewOpen(false)} color="inherit" variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.1)" }}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!newName.trim()}>Generate Key</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function PluginSetupPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)", px: 3, pt: 1.5 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ "& .MuiTabs-indicator": { bgcolor: "primary.main" } }}>
          <Tab label="Overview" />
          <Tab label="Installation & Integration" />
          <Tab label="API Key Management" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {tab === 0 && <OverviewTab />}
        {tab === 1 && <InstallationTab />}
        {tab === 2 && <ApiKeysTab />}
      </Box>
    </Box>
  );
}
