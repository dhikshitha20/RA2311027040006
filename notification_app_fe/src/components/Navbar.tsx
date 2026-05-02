import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Campus Notifications
        </Typography>
        <Box>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ textDecoration: isActive("/") ? "underline" : "none" }}
          >
            All
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/priority")}
            sx={{ textDecoration: isActive("/priority") ? "underline" : "none" }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;