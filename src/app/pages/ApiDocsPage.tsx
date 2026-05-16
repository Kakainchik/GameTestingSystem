import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlined from "@mui/icons-material/ExpandLessOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import KeyboardArrowRightOutlined from "@mui/icons-material/KeyboardArrowRightOutlined";

type DocSection = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

const SECTIONS: DocSection[] = [
  { id: "introduction", label: "Introduction", children: [
    { id: "getting-started", label: "Getting Started" },
    { id: "key-concepts", label: "Key Concepts" },
  ]},
  { id: "authentication", label: "Authentication", children: [
    { id: "api-keys", label: "API Keys" },
    { id: "rate-limits", label: "Rate Limits" },
  ]},
  { id: "errors", label: "Errors", children: [
    { id: "error-codes", label: "Error Codes" },
    { id: "error-handling", label: "Handling Errors" },
  ]},
  { id: "endpoints", label: "Endpoints", children: [
    { id: "sessions", label: "Sessions API" },
    { id: "events", label: "Events API" },
    { id: "metrics", label: "Metrics API" },
    { id: "testers", label: "Testers API" },
  ]},
];

type DocContent = {
  title: string;
  subtitle: string;
  description: string;
  note?: string;
  curl?: string;
  response?: string;
  method?: string;
  endpoint?: string;
  params?: { name: string; type: string; required: boolean; desc: string }[];
};

const CONTENT: Record<string, DocContent> = {
  "introduction": {
    title: "Introduction",
    subtitle: "GameMetrics QA Platform API",
    description: `GameMetrics provides a RESTful API that allows your game to send telemetry data directly to your configured servers. The API is designed to be lightweight, fast, and easy to integrate with any game engine.

All API requests must include your server's API key in the Authorization header. Data is transmitted as JSON over HTTPS.`,
    note: "The GameMetrics API is currently at v1. All endpoints are prefixed with /api/v1/.",
  },
  "getting-started": {
    title: "Getting Started",
    subtitle: "Your first API call in 3 steps",
    description: `To start sending data from your game:

1. Create a server in the GameMetrics dashboard and obtain an API key.
2. Install the GameMetrics SDK plugin for your game engine (Unity, Unreal, or Godot).
3. Initialize the SDK with your server URL and API key, then start sending events.

Alternatively, you can use the REST API directly with any HTTP client.`,
    curl: `curl -X POST https://api.gamemetrics.io/v1/sessions \\
  -H "Authorization: Bearer gm_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tester_id": "usr_abc123",
    "level": "dungeon_01",
    "build_version": "0.4.2"
  }'`,
    response: `{
  "session_id": "ses_7xKp3mNqR9",
  "status": "active",
  "started_at": "2026-05-16T09:41:00Z",
  "server_id": "srv_Mario-Alpha",
  "tester_id": "usr_abc123",
  "level": "dungeon_01",
  "build_version": "0.4.2"
}`,
  },
  "key-concepts": {
    title: "Key Concepts",
    subtitle: "Understanding GameMetrics data model",
    description: `GameMetrics is organized around a few core concepts:

• Server — An isolated data collection environment for a specific game project.
• Session — A single continuous play session by a tester, tied to a level or area.
• Event — A discrete timestamped action within a session (e.g., player died, chest opened).
• Metric — A named data point with a type (integer, float, boolean, string, vector).
• Tester — A registered player whose sessions are being tracked.

Data flows from the game → SDK → API → Server → Dashboard.`,
  },
  "authentication": {
    title: "Authentication",
    subtitle: "How to authenticate with the API",
    description: `All requests to the GameMetrics API must be authenticated using a Bearer token. This token is your server's API key, obtained from the server settings in the dashboard.

Include the key in every request using the Authorization header:`,
    curl: `curl -X GET https://api.gamemetrics.io/v1/servers/srv_abc123 \\
  -H "Authorization: Bearer gm_live_YOUR_API_KEY_HERE"`,
    response: `{
  "id": "srv_abc123",
  "name": "Mario-Alpha",
  "game": "Mario",
  "region": "eu-west",
  "status": "active",
  "data_types": 8,
  "tester_count": 12
}`,
    note: "Never expose your API key in client-side code or public repositories. Store it in environment variables or a secure secrets manager.",
  },
  "api-keys": {
    title: "API Keys",
    subtitle: "Managing server API keys",
    description: `Each GameMetrics server has its own API key. Keys are prefixed with gm_live_ for production and gm_test_ for sandbox environments.

You can obtain, view, and regenerate keys from the Server Settings modal in the Dashboard → Servers → gear icon → Obtain API Key.

Keys can be rotated at any time. After regeneration, the old key is immediately invalidated.`,
    note: "If you believe a key has been compromised, regenerate it immediately from the Server Settings modal.",
  },
  "rate-limits": {
    title: "Rate Limits",
    subtitle: "Request quotas and throttling",
    description: `The API enforces rate limits per API key to ensure platform stability. Limits vary by plan:

• Free plan: 100 requests/minute, 50,000 events/day
• Pro plan: 1,000 requests/minute, 5,000,000 events/day
• Studio plan: Unlimited

Rate limit headers are included in every response.`,
    response: `X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1747387260

{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Retry after 1747387260.",
  "retry_after": 13
}`,
  },
  "error-codes": {
    title: "Error Codes",
    subtitle: "Standard HTTP error responses",
    description: `The API uses conventional HTTP status codes to indicate success or failure. Error responses include a machine-readable error code and a human-readable message.

Common status codes:
• 200 OK — Request succeeded
• 201 Created — Resource created
• 400 Bad Request — Invalid parameters
• 401 Unauthorized — Missing or invalid API key
• 403 Forbidden — Key lacks required permissions
• 404 Not Found — Resource does not exist
• 429 Too Many Requests — Rate limit exceeded
• 500 Internal Server Error — Platform issue`,
    response: `{
  "error": "unauthorized",
  "message": "Invalid or missing Authorization header.",
  "status": 401,
  "docs": "https://docs.gamemetrics.io/errors/unauthorized"
}`,
  },
  "error-handling": {
    title: "Handling Errors",
    subtitle: "Best practices for robust integrations",
    description: `We recommend implementing exponential backoff for 429 and 5xx errors. The SDK handles this automatically, but if you're using raw HTTP calls:

• Retry 429 responses after the Retry-After header value.
• Retry 500/502/503 responses with exponential backoff (1s, 2s, 4s…).
• Do not retry 400/401/403/404 responses — they indicate a request issue.
• Log all errors with the session_id for easier debugging.`,
    curl: `# Checking error details in the response body
curl -X POST https://api.gamemetrics.io/v1/events \\
  -H "Authorization: Bearer INVALID_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"session_id": "ses_xyz"}'`,
    response: `HTTP/2 401
Content-Type: application/json

{
  "error": "unauthorized",
  "message": "The provided API key is invalid or has been revoked.",
  "status": 401
}`,
  },
  "sessions": {
    title: "Sessions API",
    subtitle: "POST /v1/sessions",
    method: "POST",
    endpoint: "/v1/sessions",
    description: "Creates a new testing session for a tester. Call this when the player enters a level or starts a run. The returned session_id must be included in all subsequent event and metric calls.",
    params: [
      { name: "tester_id", type: "string", required: true, desc: "Unique identifier for the tester (email or UUID)" },
      { name: "level", type: "string", required: true, desc: "The level or area identifier (e.g. dungeon_01)" },
      { name: "build_version", type: "string", required: false, desc: "Current build version for traceability" },
      { name: "metadata", type: "object", required: false, desc: "Arbitrary key-value pairs for context" },
    ],
    curl: `curl -X POST https://api.gamemetrics.io/v1/sessions \\
  -H "Authorization: Bearer gm_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tester_id": "magical.matrix@testmail.com",
    "level": "dungeon_02",
    "build_version": "0.5.1",
    "metadata": { "difficulty": "hard", "seed": "8834" }
  }'`,
    response: `{
  "session_id": "ses_9aYqTvLmX2",
  "status": "active",
  "started_at": "2026-05-16T10:15:00Z",
  "tester_id": "magical.matrix@testmail.com",
  "level": "dungeon_02",
  "build_version": "0.5.1"
}`,
  },
  "events": {
    title: "Events API",
    subtitle: "POST /v1/events",
    method: "POST",
    endpoint: "/v1/events",
    description: "Records a discrete timestamped event within an active session. Events represent meaningful in-game actions — player deaths, item pickups, quest completions, etc.",
    params: [
      { name: "session_id", type: "string", required: true, desc: "Active session ID returned from /sessions" },
      { name: "event_name", type: "string", required: true, desc: "The event type name as configured on the server" },
      { name: "timestamp", type: "ISO 8601", required: false, desc: "Event time (defaults to server receive time)" },
      { name: "payload", type: "object", required: false, desc: "Additional event data (position, value, context)" },
    ],
    curl: `curl -X POST https://api.gamemetrics.io/v1/events \\
  -H "Authorization: Bearer gm_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "session_id": "ses_9aYqTvLmX2",
    "event_name": "player_died",
    "payload": {
      "position": { "x": 245.0, "y": 0.0, "z": -88.3 },
      "cause": "trap_spike",
      "health_at_death": 12
    }
  }'`,
    response: `{
  "event_id": "evt_K3mRpQn7Lx",
  "session_id": "ses_9aYqTvLmX2",
  "event_name": "player_died",
  "recorded_at": "2026-05-16T10:22:14Z",
  "sequence": 47
}`,
  },
  "metrics": {
    title: "Metrics API",
    subtitle: "POST /v1/metrics",
    method: "POST",
    endpoint: "/v1/metrics",
    description: "Records a named metric value within a session. Use this for continuous or periodic measurements — health, score, card counts, timing data. Unlike events, metrics represent the current state of a value rather than a discrete action.",
    params: [
      { name: "session_id", type: "string", required: true, desc: "Active session ID" },
      { name: "metric_name", type: "string", required: true, desc: "Name as configured in Data & Event Configuration" },
      { name: "value", type: "any", required: true, desc: "The metric value (must match configured type)" },
    ],
    curl: `curl -X POST https://api.gamemetrics.io/v1/metrics \\
  -H "Authorization: Bearer gm_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "session_id": "ses_9aYqTvLmX2",
    "metric_name": "number_of_offensive_cards",
    "value": 7
  }'`,
    response: `{
  "metric_id": "mtr_Xp2WqRsN8v",
  "session_id": "ses_9aYqTvLmX2",
  "metric_name": "number_of_offensive_cards",
  "value": 7,
  "recorded_at": "2026-05-16T10:19:43Z"
}`,
  },
  "testers": {
    title: "Testers API",
    subtitle: "GET /v1/testers",
    method: "GET",
    endpoint: "/v1/testers",
    description: "Lists all registered testers for the current server, with session counts and last activity. Testers are automatically registered on first session creation. You can also retrieve, update, or delete individual testers.",
    curl: `curl -X GET "https://api.gamemetrics.io/v1/testers?limit=20&offset=0" \\
  -H "Authorization: Bearer gm_live_YOUR_KEY"`,
    response: `{
  "testers": [
    {
      "id": "usr_abc123",
      "email": "magical.matrix@testmail.com",
      "nickname": "ShaderMagician",
      "session_count": 14,
      "last_seen": "2026-05-16T09:41:00Z",
      "registered_at": "2026-04-10T14:22:00Z"
    },
    {
      "id": "usr_def456",
      "email": "oleg.olegov@testmail.com",
      "nickname": "SpeedDesigner",
      "session_count": 31,
      "last_seen": "2026-05-16T08:05:00Z",
      "registered_at": "2026-04-10T14:25:00Z"
    }
  ],
  "total": 12,
  "limit": 20,
  "offset": 0
}`,
  },
};

const METHOD_COLORS: Record<string, { bg: string; color: string }> = {
  GET: { bg: "rgba(16,185,129,0.15)", color: "#10b981" },
  POST: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  DELETE: { bg: "rgba(244,63,94,0.15)", color: "#f43f5e" },
  PATCH: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
};

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 0.75, bgcolor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Typography variant="caption" sx={{ color: "#8b8fa8", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{language}</Typography>
        <IconButton size="small" onClick={handleCopy} sx={{ color: "text.secondary" }}>
          {copied ? <CheckOutlined sx={{ fontSize: 14, color: "success.main" }} /> : <ContentCopyOutlined sx={{ fontSize: 14 }} />}
        </IconButton>
      </Box>
      <Box
        component="pre"
        sx={{ m: 0, p: 2, bgcolor: "#0a0b14", overflowX: "auto", fontSize: "0.82rem", lineHeight: 1.7, fontFamily: '"Fira Code", "Fira Mono", "JetBrains Mono", monospace', color: "#c9d1d9" }}
      >
        <code>{code}</code>
      </Box>
    </Box>
  );
}

export function ApiDocsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ introduction: true, endpoints: true });
  const [activeId, setActiveId] = useState("getting-started");

  const content = CONTENT[activeId];
  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left nav */}
      <Box sx={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", overflow: "auto", bgcolor: "#0f1120", py: 2 }}>
        <Box sx={{ px: 2, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <MenuBookOutlined sx={{ fontSize: 16, color: "primary.light" }} />
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
            API Reference
          </Typography>
        </Box>
        <List disablePadding>
          {SECTIONS.map((section) => (
            <Box key={section.id}>
              <ListItemButton
                onClick={() => toggle(section.id)}
                sx={{ py: 0.75, px: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.04)" } }}
              >
                <ListItemText
                  primary={section.label}
                  primaryTypographyProps={{ variant: "body2", fontWeight: 600, color: "text.primary" }}
                />
                {section.children && (
                  expanded[section.id] ? <ExpandLessOutlined sx={{ fontSize: 16, color: "text.secondary" }} /> : <ExpandMoreOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
                )}
              </ListItemButton>

              {section.children && (
                <Collapse in={!!expanded[section.id]}>
                  {section.children.map((child) => (
                    <ListItemButton
                      key={child.id}
                      selected={activeId === child.id}
                      onClick={() => setActiveId(child.id)}
                      sx={{
                        py: 0.6, pl: 3.5, pr: 2,
                        "&.Mui-selected": { bgcolor: "rgba(99,102,241,0.12)", color: "primary.light" },
                        "&.Mui-selected:hover": { bgcolor: "rgba(99,102,241,0.18)" },
                        "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                      }}
                    >
                      {activeId === child.id && <KeyboardArrowRightOutlined sx={{ fontSize: 14, mr: 0.5, color: "primary.light" }} />}
                      <ListItemText
                        primary={child.label}
                        primaryTypographyProps={{ variant: "body2", color: activeId === child.id ? "primary.light" : "text.secondary", fontWeight: activeId === child.id ? 600 : 400 }}
                      />
                    </ListItemButton>
                  ))}
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Content area */}
      <Box sx={{ flex: 1, overflow: "auto", p: 4, maxWidth: 900 }}>
        {content ? (
          <>
            <Box sx={{ mb: 3 }}>
              {content.method && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Chip
                    label={content.method}
                    size="small"
                    sx={{ ...METHOD_COLORS[content.method], fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem" }}
                  />
                  <Typography variant="body1" sx={{ fontFamily: "monospace", color: "text.secondary" }}>{content.endpoint}</Typography>
                </Box>
              )}
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{content.title}</Typography>
              <Typography variant="body1" color="text.secondary">{content.subtitle}</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: "pre-line", color: "text.secondary", mb: 3 }}>
              {content.description}
            </Typography>

            {content.note && (
              <Paper sx={{ p: 2, mb: 3, bgcolor: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong style={{ color: "#818cf8" }}>Note: </strong>{content.note}
                </Typography>
              </Paper>
            )}

            {content.params && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Request Parameters</Typography>
                <Box sx={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  {content.params.map((p, i) => (
                    <Box key={p.name}>
                      {i > 0 && <Divider />}
                      <Box sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Box sx={{ minWidth: 160 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                            <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700, color: "#818cf8" }}>{p.name}</Typography>
                            {p.required && <Chip label="required" size="small" sx={{ height: 16, fontSize: "0.62rem", bgcolor: "rgba(244,63,94,0.1)", color: "#f43f5e" }} />}
                          </Box>
                          <Typography variant="caption" sx={{ color: "#8b5cf6", fontFamily: "monospace" }}>{p.type}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{p.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {content.curl && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Example Request</Typography>
                <CodeBlock code={content.curl} language="cURL" />
              </Box>
            )}

            {content.response && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Example Response</Typography>
                <CodeBlock code={content.response} language="JSON" />
              </Box>
            )}

            {/* Navigation buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Button variant="outlined" size="small" color="inherit" sx={{ borderColor: "rgba(255,255,255,0.1)" }}>
                Next →
              </Button>
            </Box>
          </>
        ) : (
          <Typography color="text.secondary">Select a topic from the menu.</Typography>
        )}
      </Box>
    </Box>
  );
}
