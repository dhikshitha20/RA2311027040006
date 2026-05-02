import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;