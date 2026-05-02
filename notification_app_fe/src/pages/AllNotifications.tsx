import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Chip, Box, CircularProgress } from "@mui/material";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjg1MTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTMxMSwiaWF0IjoxNzc3NzA0NDExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNjlkZjc4ZWUtNjQ3YS00OGUwLTg5NWMtN2Q5N2QxZTJmYzUzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGhpa3NoaWRoYSIsInN1YiI6ImJjODAxOGUwLTFkOGQtNGQ1Yy05ODM2LTZjY2I3NzllM2Q2MSJ9LCJlbWFpbCI6ImRuODUxOUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRoaWtzaGlkaGEiLCJyb2xsTm8iOiJyYTIzMTEwMjcwNDAwMDYiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJiYzgwMThlMC0xZDhkLTRkNWMtOTgzNi02Y2NiNzc5ZTNkNjEiLCJjbGllbnRTZWNyZXQiOiJXVWVHeWRrRkttZUdkQWFRIn0.DAZjosU7-oszzBp9DpPWWXbn7zxUAEatgCgmdnDqgWw";

const chipColor: any = { Placement: "success", Result: "warning", Event: "info" };

function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://20.207.122.201/evaluation-service/notifications", {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>All Notifications</Typography>
      {notifications.map(n => (
        <Card
          key={n.ID}
          onClick={() => setViewed(prev => new Set(prev).add(n.ID))}
          sx={{
            mb: 2,
            cursor: "pointer",
            borderLeft: viewed.has(n.ID) ? "4px solid #aaa" : "4px solid #1976d2",
            backgroundColor: viewed.has(n.ID) ? "#f5f5f5" : "#fff"
          }}
        >
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

export default AllNotifications;