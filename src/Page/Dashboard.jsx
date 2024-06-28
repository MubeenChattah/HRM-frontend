import React, { useEffect, useState, useRef } from "react";
import SideBar from "./SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify

export default function Dashboard() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [workLogId, setWorkLogId] = useState(null);
  const [workLogs, setWorkLogs] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null); // useRef for managing timer interval
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  let decodedToken = null;
  let userId = null;

  if (token) {
    decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
    console.log("decodedToken:", decodedToken);
  }

  useEffect(() => {
    if (token && userType === "Employee") {
      const storedCheckedIn = localStorage.getItem("checkedIn") === "true";
      const storedWorkLogId = localStorage.getItem("workLogId");
      setCheckedIn(storedCheckedIn);
      setWorkLogId(storedWorkLogId);
      fetchWorkLogs();

      if (storedCheckedIn) {
        const startTime = localStorage.getItem("checkinTime");
        if (startTime) {
          const elapsedTime = Math.floor(
            (Date.now() - new Date(startTime).getTime()) / 1000
          );
          setTimer(elapsedTime);
          startTimer();
        }
      }
    } else {
      navigate("/");
    }

    // Clear interval on component unmount
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [token, navigate]);

  const fetchWorkLogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/work-log/by-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkLogs(response.data);
    } catch (error) {
      console.error("Error fetching worklogs:", error);
      toast.error("Error fetching worklogs");
    }
  };

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
        stopTimer();
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
        localStorage.setItem("checkinTime", new Date().toISOString());
        startTimer();
      }

      console.log("response.data:", response.data);
      if (!checkedIn) {
        setWorkLogId(response.data.id); // Update workLogId state with the returned id
        localStorage.setItem("workLogId", response.data.id); // Store workLogId in local storage
      } else {
        localStorage.removeItem("workLogId"); // Remove workLogId from local storage
        setWorkLogId(null); // Clear workLogId state
      }
      setCheckedIn(!checkedIn);
      localStorage.setItem("checkedIn", !checkedIn); // Update checkedIn status in local storage
    } catch (errors) {
      console.log(errors);
      toast.error(errors.response.data.message || "An error occurred");
    }
  };

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval.current);
    timerInterval.current = null;
    localStorage.removeItem("checkinTime");
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTableTime = (dateTimeString) => {
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "UTC",
    };

    const date = new Date(dateTimeString);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return formattedTime;
  };

  const formatDate = (dateTimeString) => {
    const dateOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    };

    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);

    return formattedDate;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography paragraph></Typography>
        <Button variant="outlined" onClick={handleClick}>
          {checkedIn ? "Check-Out" : "Check-In"}
        </Button>
        <Card
          variant="outlined"
          sx={{ mt: 2, width: "200px", textAlign: "center" }}
        >
          <CardContent>
            <Typography variant="h6">Timer</Typography>
            <Typography
              variant="h4"
              sx={{ color: checkedIn ? "green" : "red", fontWeight: "bold" }}
            >
              {formatTime(timer)}
            </Typography>
          </CardContent>
        </Card>
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Check-in Time</b>
                </TableCell>
                <TableCell>
                  <b>Check-out Time</b>
                </TableCell>
                <TableCell>
                  <b>Time Worked</b>
                </TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Department</b>
                </TableCell>
                <TableCell>
                  <b>Team Leader</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user.name}</TableCell>
                  <TableCell>{formatTableTime(log.checkinTime)}</TableCell>
                  <TableCell>
                    {log.checkoutTime
                      ? formatTableTime(log.checkoutTime)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{log.workingTime} mins</TableCell>
                  <TableCell>{formatDate(log.checkinTime)}</TableCell>
                  <TableCell>{log.user.department.departmentName}</TableCell>
                  <TableCell>{log.user.department.teamLeader}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ToastContainer />
      </Box>
    </Box>
  );
}
