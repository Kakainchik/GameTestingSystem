import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlined from "@mui/icons-material/TrendingDownOutlined";
import RemoveOutlined from "@mui/icons-material/RemoveOutlined";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";

const SERVERS = [
  { id: "s1", name: "Mario-Alpha", game: "Mario" },
  { id: "s2", name: "WiscoElysium-Beta", game: "Wisco Elysium" },
  { id: "s3", name: "TotalFantasyGame-QA", game: "Total Fantasy Game" },
  { id: "s4", name: "TetrisGame-Test", game: "Tetris Adventure" },
];

const LEVELS = [
  { id: "l1", name: "Tutorial", type: "Tutorial" },
  { id: "l2", name: "Forest Path", type: "Overworld" },
  { id: "l3", name: "Dungeon — Level 1", type: "Dungeon" },
  { id: "l4", name: "Dungeon — Level 2", type: "Dungeon" },
  { id: "l5", name: "Dungeon — Level 3", type: "Dungeon" },
  { id: "l6", name: "Boss — The Lich", type: "Boss" },
  { id: "l7", name: "Village Hub", type: "Hub" },
];

const METRICS = [
  { id: "m1", name: "Number of offensive cards", unit: "cards" },
  { id: "m2", name: "Player Health", unit: "HP" },
  { id: "m3", name: "Time per floor", unit: "min" },
  { id: "m4", name: "Cards played", unit: "cards" },
  { id: "m5", name: "Run completed", unit: "%" },
];

type BarEntry = { level: string; avg: number; median: number; min: number; max: number; sessions: number };

const CHART_DATA: Record<string, BarEntry[]> = {
  m1: [
    { level: "Tutorial", avg: 2.1, median: 2, min: 0, max: 5, sessions: 48 },
    { level: "Forest Path", avg: 3.4, median: 3, min: 1, max: 7, sessions: 45 },
    { level: "Dungeon 1", avg: 5.8, median: 6, min: 2, max: 10, sessions: 44 },
    { level: "Dungeon 2", avg: 6.3, median: 6, min: 3, max: 11, sessions: 41 },
    { level: "Dungeon 3", avg: 7.1, median: 7, min: 4, max: 13, sessions: 38 },
    { level: "Boss Lich", avg: 8.9, median: 9, min: 5, max: 14, sessions: 35 },
    { level: "Village Hub", avg: 1.2, median: 1, min: 0, max: 4, sessions: 46 },
  ],
  m2: [
    { level: "Tutorial", avg: 95.4, median: 100, min: 70, max: 100, sessions: 48 },
    { level: "Forest Path", avg: 81.2, median: 85, min: 40, max: 100, sessions: 45 },
    { level: "Dungeon 1", avg: 67.8, median: 70, min: 20, max: 100, sessions: 44 },
    { level: "Dungeon 2", avg: 54.1, median: 55, min: 10, max: 95, sessions: 41 },
    { level: "Dungeon 3", avg: 42.3, median: 40, min: 5, max: 90, sessions: 38 },
    { level: "Boss Lich", avg: 28.7, median: 25, min: 1, max: 85, sessions: 35 },
    { level: "Village Hub", avg: 88.6, median: 90, min: 60, max: 100, sessions: 46 },
  ],
  m3: [
    { level: "Tutorial", avg: 4.2, median: 4.0, min: 2.1, max: 8.5, sessions: 48 },
    { level: "Forest Path", avg: 6.7, median: 6.5, min: 3.2, max: 12.1, sessions: 45 },
    { level: "Dungeon 1", avg: 9.4, median: 9.1, min: 5.0, max: 18.3, sessions: 44 },
    { level: "Dungeon 2", avg: 11.2, median: 11.0, min: 6.5, max: 21.7, sessions: 41 },
    { level: "Dungeon 3", avg: 13.8, median: 13.5, min: 7.8, max: 26.4, sessions: 38 },
    { level: "Boss Lich", avg: 8.3, median: 7.9, min: 4.2, max: 19.0, sessions: 35 },
    { level: "Village Hub", avg: 2.1, median: 2.0, min: 0.8, max: 4.5, sessions: 46 },
  ],
  m4: [
    { level: "Tutorial", avg: 8, median: 8, min: 3, max: 14, sessions: 48 },
    { level: "Forest Path", avg: 14, median: 14, min: 6, max: 23, sessions: 45 },
    { level: "Dungeon 1", avg: 22, median: 21, min: 10, max: 38, sessions: 44 },
    { level: "Dungeon 2", avg: 27, median: 26, min: 13, max: 45, sessions: 41 },
    { level: "Dungeon 3", avg: 31, median: 30, min: 16, max: 52, sessions: 38 },
    { level: "Boss Lich", avg: 19, median: 18, min: 9, max: 33, sessions: 35 },
    { level: "Village Hub", avg: 5, median: 5, min: 2, max: 10, sessions: 46 },
  ],
  m5: [
    { level: "Tutorial", avg: 98, median: 100, min: 0, max: 100, sessions: 48 },
    { level: "Forest Path", avg: 87, median: 100, min: 0, max: 100, sessions: 45 },
    { level: "Dungeon 1", avg: 73, median: 100, min: 0, max: 100, sessions: 44 },
    { level: "Dungeon 2", avg: 61, median: 100, min: 0, max: 100, sessions: 41 },
    { level: "Dungeon 3", avg: 49, median: 0, min: 0, max: 100, sessions: 38 },
    { level: "Boss Lich", avg: 38, median: 0, min: 0, max: 100, sessions: 35 },
    { level: "Village Hub", avg: 95, median: 100, min: 0, max: 100, sessions: 46 },
  ],
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "#1e2130", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, p: 1.5, minWidth: 140 }}>
      <Typography variant="caption" sx={{ color: "#8b8fa8", display: "block", mb: 0.5 }}>{label}</Typography>
      {payload.map((p: any) => (
        <Typography key={p.name} variant="body2" sx={{ color: p.fill }}>
          {p.name}: <strong>{p.value} {unit}</strong>
        </Typography>
      ))}
    </Box>
  );
};

export function CollectedDataPage() {
  const [serverId, setServerId] = useState("");
  const [metricId, setMetricId] = useState("");

  const chartData = metricId ? CHART_DATA[metricId] : null;
  const metric = METRICS.find((m) => m.id === metricId);
  const globalAvg = chartData ? chartData.reduce((s, d) => s + d.avg, 0) / chartData.length : 0;
  const medianValues = chartData ? [...chartData.map((d) => d.median)].sort((a, b) => a - b) : [];
  const globalMedian = medianValues.length
    ? medianValues[Math.floor(medianValues.length / 2)]
    : 0;
  const minValue = chartData ? Math.min(...chartData.map((d) => d.min)) : 0;
  const maxValue = chartData ? Math.max(...chartData.map((d) => d.max)) : 0;
  const totalSessions = chartData ? chartData.reduce((sum, d) => sum + d.sessions, 0) : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 1200 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Collected Data</Typography>
        <Typography variant="body2" color="text.secondary">Explore and visualize gameplay statistics across sessions and levels</Typography>
      </Box>

      {/* Filter row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select fullWidth label="Server" size="small" value={serverId}
            onChange={(e) => { setServerId(e.target.value); setMetricId(""); }}
          >
            <MenuItem value=""><em>Select a server...</em></MenuItem>
            {SERVERS.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select fullWidth label="Data Metric" size="small" value={metricId}
            onChange={(e) => setMetricId(e.target.value)}
            disabled={!serverId}
          >
            <MenuItem value=""><em>{serverId ? "Select a metric..." : "Select server first"}</em></MenuItem>
            {METRICS.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>

      {/* Empty state */}
      {!serverId && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, color: "text.secondary" }}>
          <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)", mb: 2 }}>
            <BarChartOutlined sx={{ fontSize: 40, color: "text.secondary" }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>Select a server to begin</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, textAlign: "center" }}>
            Choose a server and metric to explore aggregated data and comparisons across all levels.
          </Typography>
        </Box>
      )}

      {/* Stats + Chart */}
      {chartData && metric && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Average", value: globalAvg.toFixed(1), unit: metric.unit },
              { label: "Median", value: String(globalMedian), unit: metric.unit },
              { label: "Min / Max", value: `${minValue} – ${maxValue}`, unit: metric.unit },
              { label: "Sessions recorded", value: String(totalSessions), unit: "sessions" },
            ].map((stat) => (
              <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
                <Card elevation={0}>
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>{stat.label}</Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{stat.unit}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card elevation={0}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{metric.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comparison across all levels · {SERVERS.find((s) => s.id === serverId)?.game}
                  </Typography>
                </Box>
                <Chip
                  icon={<InfoOutlined sx={{ fontSize: "0.9rem !important" }} />}
                  label="All levels"
                  size="small"
                  sx={{ bgcolor: "rgba(99,102,241,0.1)", color: "primary.light", fontSize: "0.75rem" }}
                />
              </Box>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData!} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#8b8fa8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8b8fa8" }} axisLine={false} tickLine={false} unit={` ${metric.unit}`} width={60} />
                  <Tooltip content={<CustomTooltip unit={metric.unit} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <ReferenceLine y={globalAvg} stroke="#8b8fa8" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Avg", fontSize: 10, fill: "#8b8fa8", position: "insideTopRight" }} />
                  <Bar dataKey="avg" name="Average" radius={[5, 5, 0, 0]} fill="#6366f1" fillOpacity={0.85} />
                  <Bar dataKey="median" name="Median" radius={[5, 5, 0, 0]} fill="#10b981" fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>

              <Box sx={{ display: "flex", gap: 3, mt: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { color: "#6366f1", label: "Average" },
                  { color: "#10b981", label: "Median" },
                ].map((l) => (
                  <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box sx={{ width: 20, height: 3, borderRadius: 1, bgcolor: l.color }} />
                    <Typography variant="caption" color="text.secondary">{l.label}</Typography>
                  </Box>
                ))}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box sx={{ width: 20, height: 0, borderTop: "2px dashed #8b8fa8" }} />
                  <Typography variant="caption" color="text.secondary">Global average</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
