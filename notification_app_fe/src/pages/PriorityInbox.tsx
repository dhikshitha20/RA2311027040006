import { useEffect, useState } from "react";
import {
  Container, Typography, Card, CardContent,
  Chip, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
  score?: number;
}

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjg1MTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTMxMSwiaWF0IjoxNzc3NzA0NDExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNjlkZjc4ZWUtNjQ3YS00OGUwLTg5NWMtN2Q5N2QxZTJmYzUzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGhpa3NoaWRoYSIsInN1YiI6ImJjODAxOGUwLTFkOGQtNGQ1Yy05ODM2LTZjY2I3NzllM2Q2MSJ9LCJlbWFpbCI6ImRuODUxOUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRoaWtzaGlkaGEiLCJyb2xsTm8iOiJyYTIzMTEwMjcwNDAwMDYiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJiYzgwMThlMC0xZDhkLTRkNWMtOTgzNi02Y2NiNzc5ZTNkNjEiLCJjbGllbnRTZWNyZXQiOiJXVWVHeWRrRkttZUdkQWFRIn0.DAZjosU7-oszzBp9DpPWWXbn7zxUAEatgCgmdnDqgWw";

const weights: any = { Placement: 3, Result: 2, Event: 1 };
const chipColor: any = { Placement: "success", Result: "warning", Event: "info" };

function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("http://20.207.122.201/evaluation-service/notifications", {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    })
      .then(res => res.json())
      .then(data => {
        const scored = data.notifications
          .map((n: Notification) => ({
            ...n,
            score: (weights[n.Type] || 0) + 1 / (1 + (Date.now() - new Date(n.Timestamp).getTime()) / 1000)
          }))
          .sort((a: any, b: any) => b.score - a.score);
        setNotifications(scored);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = notifications
    .filter(n => filter === "All" || n.Type === filter)
    .slice(0, topN);

  if (loading) return <CircularProgress sx={{ mt: 5, ml: "50%" }} />;

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Priority Inbox</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl size="small">
          <InputLabel>Show</InputLabel>
          <Select value={topN} label="Show" onChange={e => setTopN(Number(e.target.value))}>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Type</InputLabel>
          <Select value={filter} label="Type" onChange={e => setFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filtered.map(n => (
        <Card key={n.ID} onClick={() => setViewed(prev => new Set(prev).add(n.ID))}
          sx={{ mb: 2, cursor: "pointer",
            borderLeft: viewed.has(n.ID) ? "4px solid #aaa" : "4px solid #1976d2",
            backgroundColor: viewed.has(n.ID) ? "#f5f5f5" : "#fff" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{n.Message}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {!viewed.has(n.ID) && <Chip label="new" color="primary" size="small" />}
                <Chip label={n.Type} color={chipColor[n.Type]} size="small" />
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {new Date(n.Timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default PriorityInbox;