import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlined from "@mui/icons-material/TrendingDownOutlined";
import PlayCircleOutlined from "@mui/icons-material/PlayCircleOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import BugReportOutlined from "@mui/icons-material/BugReportOutlined";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const activityData = [
  { date: "May 3", sessions: 9, players: 6 },
  { date: "May 4", sessions: 14, players: 9 },
  { date: "May 5", sessions: 11, players: 8 },
  { date: "May 6", sessions: 18, players: 12 },
  { date: "May 7", sessions: 22, players: 15 },
  { date: "May 8", sessions: 17, players: 11 },
  { date: "May 9", sessions: 25, players: 17 },
  { date: "May 10", sessions: 30, players: 20 },
  { date: "May 11", sessions: 28, players: 19 },
  { date: "May 12", sessions: 34, players: 24 },
  { date: "May 13", sessions: 31, players: 21 },
  { date: "May 14", sessions: 38, players: 26 },
  { date: "May 15", sessions: 42, players: 29 },
  { date: "May 16", sessions: 36, players: 25 },
];

const STATS = [
  { label: "Total Sessions", value: "2,847", delta: "+12% this week", up: true, icon: <PlayCircleOutlined />, color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { label: "Active Testers", value: "34", delta: "+3 today", up: true, icon: <PeopleOutlined />, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { label: "Reported Issues", value: "127", delta: "+8 today", up: false, icon: <BugReportOutlined />, color: "#f43f5e", bg: "rgba(244,63,94,0.12)" },
  { label: "Finished Scenarios", value: "891", delta: "73% completion rate", up: true, icon: <TaskAltOutlined />, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
];

const TOP_PROJECTS = [
  { name: "Mario-Alpha", game: "Mario", sessions: 842, progress: 68, color: "#6366f1", online: true },
  { name: "WiscoElysium-Beta", game: "Wisco Elysium", sessions: 534, progress: 42, color: "#10b981", online: true },
  { name: "TotalFantasyGame-QA", game: "Total Fantasy Game", sessions: 721, progress: 81, color: "#f59e0b", online: false },
  { name: "TetrisGame-Test", game: "Tetris Adventure", sessions: 290, progress: 29, color: "#38bdf8", online: true },
];

const SEVERITY_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  critical: { bg: "rgba(244,63,94,0.12)", color: "#f43f5e", label: "Critical" },
  high: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "High" },
  medium: { bg: "rgba(99,102,241,0.12)", color: "#818cf8", label: "Medium" },
  low: { bg: "rgba(139,143,168,0.12)", color: "#8b8fa8", label: "Low" },
};

const RECENT_ISSUES = [
  { id: "ISS-051", title: "Character clips through dungeon wall at coord (245, 0, -88)", sev: "critical", project: "Mario", reporter: "ShadowBlade99", time: "10 min ago" },
  { id: "ISS-050", title: "Card UI overlaps when 10+ cards in hand", sev: "high", project: "Mario", reporter: "CriticalHit", time: "34 min ago" },
  { id: "ISS-049", title: "Space station docking animation skips on low-end GPU", sev: "medium", project: "WiscoElysium", reporter: "PixelHunter", time: "2 hrs ago" },
  { id: "ISS-048", title: "NPC dialogue repeats after saving and reloading", sev: "high", project: "TotalFantasyGame", reporter: "NightOwl_QA", time: "3 hrs ago" },
  { id: "ISS-047", title: "Puzzle piece drag threshold too sensitive on touch screens", sev: "low", project: "TetrisGame", reporter: "SpeedRunner42", time: "5 hrs ago" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "#1e2130", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, p: 1.5 }}>
      <Typography variant="caption" sx={{ color: "#8b8fa8", display: "block", mb: 0.5 }}>{label}</Typography>
      {payload.map((p: any) => (
        <Typography key={p.name} variant="body2" sx={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </Typography>
      ))}
    </Box>
  );
};

export function DashboardPage() {
  return (
    <Box sx={{ p: 3, maxWidth: 1400 }}>
      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STATS.map((s) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={s.label}>
            <Card elevation={0}>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: s.bg, color: s.color }}>
                    {s.icon}
                  </Box>
                  <Chip
                    icon={s.up ? <TrendingUpOutlined sx={{ fontSize: "0.9rem !important" }} /> : <TrendingDownOutlined sx={{ fontSize: "0.9rem !important" }} />}
                    label={s.delta}
                    size="small"
                    sx={{ bgcolor: s.up ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)", color: s.up ? "#10b981" : "#f43f5e", height: 22, fontSize: "0.72rem" }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25, color: "text.primary" }}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Activity Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card elevation={0} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Testing Activity</Typography>
                  <Typography variant="body2" color="text.secondary">Active sessions and players — last 14 days</Typography>
                </Box>
                <Chip label="Live" size="small" sx={{ bgcolor: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: "0.72rem" }} />
              </Box>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPlayers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8b8fa8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8b8fa8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#6366f1" strokeWidth={2} fill="url(#gradSessions)" dot={false} />
                  <Area type="monotone" dataKey="players" name="Active Players" stroke="#10b981" strokeWidth={2} fill="url(#gradPlayers)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <Box sx={{ display: "flex", gap: 3, mt: 1.5, justifyContent: "center" }}>
                {[{ color: "#6366f1", label: "Sessions" }, { color: "#10b981", label: "Active Players" }].map((l) => (
                  <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box sx={{ width: 24, height: 2.5, borderRadius: 1, bgcolor: l.color }} />
                    <Typography variant="caption" color="text.secondary">{l.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Projects */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card elevation={0} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Top Projects</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Ranked by session activity</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {TOP_PROJECTS.map((p, i) => (
                  <Box key={p.name}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, width: 16 }}>#{i + 1}</Typography>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{p.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{p.sessions.toLocaleString()} sessions</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.online ? "#10b981" : "#8b8fa8" }} />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={p.progress}
                      sx={{ height: 5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", "& .MuiLinearProgress-bar": { bgcolor: p.color, borderRadius: 3 } }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: "block" }}>{p.progress}% of target sessions</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Issues */}
        <Grid size={{ xs: 12 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Reported Issues</Typography>
                  <Typography variant="body2" color="text.secondary">Across all active servers</Typography>
                </Box>
                <Chip label="127 open" size="small" sx={{ bgcolor: "rgba(244,63,94,0.1)", color: "#f43f5e", fontSize: "0.75rem" }} />
              </Box>
              <Divider sx={{ mb: 1 }} />
              <List disablePadding>
                {RECENT_ISSUES.map((issue, i) => {
                  const sev = SEVERITY_COLORS[issue.sev];
                  return (
                    <Box key={issue.id}>
                      {i > 0 && <Divider />}
                      <ListItem sx={{ px: 0, py: 1.25, gap: 1 }}>
                        <ListItemAvatar sx={{ minWidth: 44 }}>
                          <Avatar sx={{ width: 34, height: 34, bgcolor: sev.bg, color: sev.color, fontSize: "0.65rem", fontWeight: 700 }}>
                            {issue.sev.slice(0, 3).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{issue.id}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{issue.title}</Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25, flexWrap: "wrap" }}>
                              <Chip label={sev.label} size="small" sx={{ height: 18, fontSize: "0.65rem", bgcolor: sev.bg, color: sev.color }} />
                              <Typography variant="caption" color="text.secondary">{issue.project}</Typography>
                              <Typography variant="caption" color="text.secondary">·</Typography>
                              <Typography variant="caption" color="text.secondary">by {issue.reporter}</Typography>
                              <Typography variant="caption" color="text.secondary">·</Typography>
                              <Typography variant="caption" color="text.secondary">{issue.time}</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </Box>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
