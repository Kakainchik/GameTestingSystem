import { useState } from "react";
import { Settings, Server, Plus, Wifi, WifiOff, Users, Database } from "lucide-react";
import { ServerSettingsModal } from "./ServerSettingsModal";

export type ServerData = {
  id: string;
  name: string;
  game: string;
  online: boolean;
  testers: number;
  dataTypes: number;
  lastActive: string;
  region: string;
};

const initialServers: ServerData[] = [
  { id: "s1", name: "Mario-Alpha", game: "Mario", online: true, testers: 12, dataTypes: 8, lastActive: "2 min ago", region: "EU-West" },
  { id: "s2", name: "WiscoElysium-Beta", game: "Wisco Elysium", online: true, testers: 5, dataTypes: 5, lastActive: "14 min ago", region: "US-East" },
  { id: "s3", name: "TotalFantasyGame-QA", game: "Total Fantasy Game", online: false, testers: 23, dataTypes: 11, lastActive: "3 days ago", region: "EU-Central" },
  { id: "s4", name: "TetrisGame-Test", game: "Tetris Adventure", online: true, testers: 8, dataTypes: 4, lastActive: "1 hr ago", region: "US-West" },
];

export function ServersView() {
  const [servers, setServers] = useState<ServerData[]>(initialServers);
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleOpenSettings = (server: ServerData) => {
    setSelectedServer(server);
    setShowSettings(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-foreground">Servers</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.9rem" }}>
            Manage your data collection servers and configurations
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          style={{ fontSize: "0.9rem" }}
        >
          <Plus size={16} />
          New Server
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} onSettings={() => handleOpenSettings(server)} />
        ))}
      </div>

      {showSettings && selectedServer && (
        <ServerSettingsModal
          server={selectedServer}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function ServerCard({ server, onSettings }: { server: ServerData; onSettings: () => void }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${server.online ? "bg-emerald-500/10" : "bg-muted"}`}>
            <Server size={20} className={server.online ? "text-emerald-500" : "text-muted-foreground"} />
          </div>
          <div>
            <h4 className="text-foreground">{server.name}</h4>
            <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>{server.game}</span>
          </div>
        </div>
        <button
          onClick={onSettings}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Server Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {server.online ? (
          <span className="flex items-center gap-1.5 text-emerald-500" style={{ fontSize: "0.8rem" }}>
            <Wifi size={13} /> Online
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: "0.8rem" }}>
            <WifiOff size={13} /> Offline
          </span>
        )}
        <span className="text-border">•</span>
        <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>{server.region}</span>
        <span className="text-border">•</span>
        <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>Last active {server.lastActive}</span>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: "0.85rem" }}>
          <Users size={14} />
          <span>{server.testers} testers</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: "0.85rem" }}>
          <Database size={14} />
          <span>{server.dataTypes} data types</span>
        </div>
      </div>
    </div>
  );
}
