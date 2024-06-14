import React, { useEffect, useState } from "react";
import SideBar from "../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Dashboard() {
  const [checkedIn, setcheckedIn] = useState(false);
  const [workLogId, setworkLogId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let decodedToken = null;
  let userId = null;

  if (token) {
    decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
    console.log("decodedToken:", decodedToken);
  }

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      const storedcheckedIn = localStorage.getItem("checkedIn") === "true";
      const storedworkLogId = localStorage.getItem("workLogId");
      setcheckedIn(storedcheckedIn);
      setworkLogId(storedworkLogId);
    }
  }, [token, navigate]);

  const handleClick = async () => {
    try {
      const apiEndpoint = checkedIn ? `checkout/${workLogId}` : "checkin";
      const requestMethod = checkedIn ? axios.patch : axios.get;

      let response;
      if (checkedIn) {
        // For checkout, include Authorization header and send PATCH request
        response = await requestMethod(
          `http://localhost:3001/work-log/${apiEndpoint}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // For checkin, just send GET request
        response = await requestMethod(
          `http://localhost:3001/work-log/${apiEndpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("response.data:", response.data);
      if (!checkedIn) {
        setworkLogId(response.data.id); // Update workLogId state with the returned id
        localStorage.setItem("workLogId", response.data.id); // Store workLogId in local storage
      } else {
        localStorage.removeItem("workLogId"); // Remove workLogId from local storage
        setworkLogId(null); // Clear workLogId state
      }
      setcheckedIn(!checkedIn);
      localStorage.setItem("checkedIn", !checkedIn); // Update checkedIn status in local storage
    } catch (errors) {
      console.log(errors);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography variant="h4">Welcome to HRMS-TDC</Typography>
        <Typography paragraph></Typography>
        <Button variant="outlined" onClick={handleClick}>
          {checkedIn ? "Check-Out" : "Check-In"}
        </Button>
      </Box>
    </Box>
  );
}
