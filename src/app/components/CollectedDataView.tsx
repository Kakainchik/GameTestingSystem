import { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChevronDown, TrendingUp, Minus, TrendingDown, BarChart2, Info, Search } from "lucide-react";

type Level = { id: string; name: string; type: string };
type Metric = { id: string; name: string; typeId: string };
type Server = { id: string; name: string; game: string };

const SERVERS: Server[] = [
  { id: "s1", name: "Mario-Alpha", game: "Mario" },
  { id: "s2", name: "WiscoElysium-Beta", game: "Wisco Elysium" },
  { id: "s3", name: "TotalFantasyGame-QA", game: "Total Fantasy Game" },
  { id: "s4", name: "TetrisGame-Test", game: "Tetris Adventure" },
];

const LEVELS: Level[] = [
  { id: "l1", name: "Tutorial", type: "Tutorial" },
  { id: "l2", name: "Forest Path", type: "Overworld" },
  { id: "l3", name: "Dungeon — Level 1", type: "Dungeon" },
  { id: "l4", name: "Dungeon — Level 2", type: "Dungeon" },
  { id: "l5", name: "Dungeon — Level 3", type: "Dungeon" },
  { id: "l6", name: "Boss — The Lich", type: "Boss" },
  { id: "l7", name: "Village Hub", type: "Hub" },
];

const METRICS: Metric[] = [
  { id: "m1", name: "Number of offensive cards", typeId: "integer" },
  { id: "m2", name: "Player Health", typeId: "integer" },
  { id: "m3", name: "Time per floor", typeId: "float" },
  { id: "m4", name: "Cards played", typeId: "integer" },
  { id: "m5", name: "Run completed", typeId: "boolean" },
];

type LevelData = {
  level: string;
  avg: number;
  median: number;
  min: number;
  max: number;
  sessions: number;
};

const CHART_DATA: Record<string, LevelData[]> = {
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

const METRIC_UNITS: Record<string, string> = {
  m1: "cards",
  m2: "HP",
  m3: "min",
  m4: "cards",
  m5: "%",
};

function SelectDropdown<T extends { id: string; name: string }>({
  label, value, options, onChange, placeholder, renderOption, searchable = false, filterOptionText,
}: {
  label: string;
  value: T | null;
  options: T[];
  onChange: (v: T) => void;
  placeholder: string;
  renderOption?: (o: T) => React.ReactNode;
  searchable?: boolean;
  filterOptionText?: (o: T) => string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value?.name ?? "");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = searchable && normalizedQuery
    ? options.filter((option) => {
      const text = (filterOptionText?.(option) ?? option.name).toLowerCase();
      return text.includes(normalizedQuery);
    })
    : options;

  return (
    <div ref={rootRef} className="relative">
      <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {searchable ? (
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={open ? query : (value?.name ?? query)}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
              }

              if (event.key === "Enter" && filteredOptions.length > 0) {
                event.preventDefault();
                onChange(filteredOptions[0]);
                setQuery(filteredOptions[0].name);
                setOpen(false);
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-lg border border-border bg-input-background py-2.5 pl-9 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/50"
          />
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={`Toggle ${label.toLowerCase()} options`}
          >
            <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-full flex items-center justify-between bg-input-background border border-border rounded-lg px-3 py-2.5 text-left hover:border-primary/40 transition-colors"
          style={{ fontSize: "0.9rem" }}
        >
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {value ? value.name : placeholder}
          </span>
          <ChevronDown size={15} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
      {open && (
        <div className="absolute z-20 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {filteredOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 hover:bg-accent transition-colors ${value?.id === opt.id ? "bg-primary/10 text-primary" : "text-foreground"}`}
              style={{ fontSize: "0.9rem" }}
            >
              {renderOption ? renderOption(opt) : opt.name}
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No matching {label.toLowerCase()} found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, sub, trend }: { label: string; value: string; unit: string; sub?: string; trend?: "up" | "down" | "neutral" }) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground";
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-muted-foreground mb-1" style={{ fontSize: "0.78rem" }}>{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-foreground" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{value}</span>
        <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>{unit}</span>
      </div>
      {sub && (
        <div className={`flex items-center gap-1 mt-1 ${trendColor}`} style={{ fontSize: "0.75rem" }}>
          <TrendIcon size={12} /> {sub}
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-lg">
        <p className="text-foreground mb-1" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ fontSize: "0.8rem", color: p.fill }}>
            {p.name}: {p.value} {unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CollectedDataView() {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  const chartData = selectedMetric ? CHART_DATA[selectedMetric.id] : null;
  const unit = selectedMetric ? METRIC_UNITS[selectedMetric.id] : "";
  const selectedLevelData = chartData?.find((d) => d.level.replace(" — ", " ").replace("Dungeon — Level", "Dungeon").startsWith(selectedLevel?.name?.split(" — ")[0] ?? "__"));
  const globalAvg = chartData ? chartData.reduce((s, d) => s + d.avg, 0) / chartData.length : 0;

  const trendValue = selectedLevelData && chartData
    ? selectedLevelData.avg - globalAvg
    : 0;

  const showChart = selectedMetric && chartData;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-foreground">Collected Data</h1>
        <p className="text-muted-foreground mt-1" style={{ fontSize: "0.9rem" }}>
          Explore and visualize gameplay statistics across sessions and levels
        </p>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        <SelectDropdown
          label="Server"
          value={selectedServer}
          options={SERVERS}
          onChange={(s) => { setSelectedServer(s); setSelectedLevel(null); setSelectedMetric(null); }}
          placeholder="Select a server..."
          renderOption={(s) => (
            <div>
              <p style={{ fontSize: "0.9rem" }}>{s.name}</p>
              <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{s.game}</p>
            </div>
          )}
        />
        <SelectDropdown
          label="Level"
          value={selectedLevel}
          options={LEVELS}
          onChange={(l) => { setSelectedLevel(l); setSelectedMetric(null); }}
          placeholder={selectedServer ? "Search levels..." : "Select server first"}
          searchable
          filterOptionText={(level) => `${level.name} ${level.type}`}
          renderOption={(l) => (
            <div className="flex items-center justify-between">
              <span>{l.name}</span>
              <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{l.type}</span>
            </div>
          )}
        />
        <SelectDropdown
          label="Data Metric"
          value={selectedMetric}
          options={METRICS}
          onChange={setSelectedMetric}
          placeholder={selectedLevel ? "Select a metric..." : "Select level first"}
        />
      </div>

      {/* Empty states */}
      {!selectedServer && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-2xl bg-muted mb-4">
            <BarChart2 size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-foreground mb-2">Start by selecting a server</h3>
          <p className="text-muted-foreground" style={{ fontSize: "0.9rem", maxWidth: 360 }}>
            Choose a data collection server, then a level, and finally the metric you want to analyze.
          </p>
        </div>
      )}

      {selectedServer && !selectedLevel && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>Search for a level to continue</p>
        </div>
      )}

      {selectedServer && selectedLevel && !selectedMetric && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>Select a metric to view its chart</p>
        </div>
      )}

      {/* Chart Section */}
      {showChart && selectedLevelData && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
            <StatCard
              label="Average (selected level)"
              value={selectedLevelData.avg.toFixed(1)}
              unit={unit}
              sub={trendValue > 0 ? `+${trendValue.toFixed(1)} vs global avg` : `${trendValue.toFixed(1)} vs global avg`}
              trend={trendValue > 0 ? "up" : trendValue < 0 ? "down" : "neutral"}
            />
            <StatCard label="Median" value={String(selectedLevelData.median)} unit={unit} />
            <StatCard label="Min / Max" value={`${selectedLevelData.min} – ${selectedLevelData.max}`} unit={unit} />
            <StatCard label="Sessions recorded" value={String(selectedLevelData.sessions)} unit="sessions" />
          </div>

          {/* Chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-foreground">{selectedMetric.name}</h3>
                <p className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>
                  Comparison across all levels · {selectedServer?.game}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground bg-accent/60 px-2.5 py-1 rounded-lg" style={{ fontSize: "0.78rem" }}>
                <Info size={12} /> Highlighted: {selectedLevel?.name}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" vertical={false} />
                <XAxis
                  dataKey="level"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  unit={` ${unit}`}
                  width={55}
                />
                <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <ReferenceLine y={globalAvg} stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Global avg", fontSize: 11, fill: "var(--muted-foreground)", position: "insideTopRight" }} />
                <Bar
                  dataKey="avg"
                  name="Average"
                  radius={[6, 6, 0, 0]}
                  fill="var(--primary)"
                  fillOpacity={0.25}
                  label={false}
                  // Highlight selected level
                  shape={(props: any) => {
                    const { x, y, width, height, level } = props;
                    const isSelected = level === selectedLevel?.name
                      || (selectedLevel?.name.includes("Level") && level === `Dungeon ${selectedLevel.name.split(" ")[selectedLevel.name.split(" ").length - 1]}`);
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={6}
                        ry={6}
                        fill={isSelected ? "#6366f1" : "var(--primary)"}
                        fillOpacity={isSelected ? 0.85 : 0.3}
                      />
                    );
                  }}
                />
                <Bar
                  dataKey="median"
                  name="Median"
                  radius={[6, 6, 0, 0]}
                  fill="#10b981"
                  fillOpacity={0.4}
                  shape={(props: any) => {
                    const { x, y, width, height, level } = props;
                    const isSelected = level === selectedLevel?.name
                      || (selectedLevel?.name.includes("Level") && level === `Dungeon ${selectedLevel.name.split(" ")[selectedLevel.name.split(" ").length - 1]}`);
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={6}
                        ry={6}
                        fill="#10b981"
                        fillOpacity={isSelected ? 0.85 : 0.35}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-3 justify-center">
              <div className="flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                <div className="w-3 h-3 rounded-sm" style={{ background: "#6366f1", opacity: 0.85 }} />
                <span className="text-muted-foreground">Average (highlighted = selected level)</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                <div className="w-3 h-3 rounded-sm" style={{ background: "#10b981", opacity: 0.8 }} />
                <span className="text-muted-foreground">Median</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                <div className="w-8 h-0.5" style={{ background: "var(--muted-foreground)", borderTop: "1.5px dashed var(--muted-foreground)" }} />
                <span className="text-muted-foreground">Global avg</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
