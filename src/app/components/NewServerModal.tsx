import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

type Props = { open: boolean; onClose: () => void; onCreate: (name: string, game: string, region: string) => void };

const REGIONS = [
  { value: "eu-west", label: "EU West (Frankfurt)" },
  { value: "eu-central", label: "EU Central (Warsaw)" },
  { value: "us-east", label: "US East (Virginia)" },
  { value: "us-west", label: "US West (Oregon)" },
  { value: "ap-south", label: "AP South (Singapore)" },
];

export function NewServerModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [region, setRegion] = useState("eu-west");
  const [description, setDescription] = useState("");

  const valid = name.trim().length > 2 && game.trim().length > 1;

  const handleSubmit = () => {
    if (!valid) return;
    onCreate(name.trim(), game.trim(), region);
    setName("");
    setGame("");
    setRegion("eu-west");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 0, pt: 3, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(99,102,241,0.12)", color: "primary.light" }}>
            <StorageOutlined />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>New Server</Typography>
            <Typography variant="body2" color="text.secondary">Configure a data collection server for your game</Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider sx={{ mt: 2 }} />

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Server Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MyGame-Alpha"
            helperText="Use a short, descriptive identifier. Avoid spaces — use hyphens."
            fullWidth
          />

          <TextField
            label="Game Title"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            placeholder="e.g. My Awesome Game"
            fullWidth
          />

          <FormControl fullWidth size="small">
            <InputLabel>Region</InputLabel>
            <Select value={region} label="Region" onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief note about the testing scope or session type"
            multiline
            rows={2}
            fullWidth
          />

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, p: 1.5, borderRadius: 2, bgcolor: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <InfoOutlined sx={{ fontSize: 16, color: "primary.light", mt: 0.2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                After creating the server, an <strong style={{ color: "#818cf8" }}>API key</strong> will be generated automatically.
                Use it to connect your game plugin via the SDK.
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75, mt: 1, flexWrap: "wrap" }}>
                {["Sessions", "Events", "Metrics", "Testers"].map((t) => (
                  <Chip key={t} label={t} size="small" sx={{ height: 18, fontSize: "0.65rem", bgcolor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ mt: 2 }} />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderColor: "rgba(255,255,255,0.1)" }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!valid}>
          Create Server
        </Button>
      </DialogActions>
    </Dialog>
  );
}
