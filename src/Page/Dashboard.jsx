import React, { useEffect, useState } from "react";
import SideBar from "../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify
import DataTable from "../Component/DataTable";

export default function Dashboard() {
  const [checkedIn, setcheckedIn] = useState(false);
  const [workLogId, setworkLogId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedInTime, setcheckedInTime] = useState(null);
  const [calculateTime, setcalculateTime] = useState(0);

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
      const storedcheckedInTime = localStorage.getItem("checkedInTime");
      setcheckedIn(storedcheckedIn);
      setworkLogId(storedworkLogId);
      if (storedcheckedInTime) {
        setcheckedInTime(new Date(storedcheckedInTime));
      }
    }
  }, [token, navigate]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      if (checkedIn && checkedInTime) {
        setcalculateTime((new Date() - checkedInTime) / 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkedIn, checkedInTime]);

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
        const now = new Date();
        setcheckedInTime(now);
        localStorage.setItem("checkedInTime", now.toString());
      } else {
        localStorage.removeItem("workLogId"); // Remove workLogId from local storage
        localStorage.removeItem("checkInTime");
        setworkLogId(null); // Clear workLogId state
        setcheckedInTime(null);
        setcalculateTime(0);
      }
      setcheckedIn(!checkedIn);
      localStorage.setItem("checkedIn", !checkedIn); // Update checkedIn status in local storage
    } catch (errors) {
      console.log(errors);
      toast.error(errors.response.data.message || "An error occurred");
    }
  };
  const formatcalculateTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ display: "flex" }}>
          <Typography paragraph>
            <Button variant="contained">
              {`Date: ${currentTime.toLocaleDateString()} `}
            </Button>
          </Typography>

          <Box sx={{ mx: "5px" }}>
            <Typography paragraph>
              <Button variant="contained">
                {`Time : ${currentTime.toLocaleTimeString()}`}
              </Button>
            </Typography>
          </Box>
        </Box>
        {checkedIn && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: checkedIn ? "green" : "red", fontWeight: "bold" }}
          >
            Time: {formatcalculateTime(calculateTime)}
          </Typography>
        )}
        <Button variant="outlined" onClick={handleClick}>
          {checkedIn ? "Check-Out" : "Check-In"}
        </Button>
        <ToastContainer />
      </Box>
    </Box>
  );
}
