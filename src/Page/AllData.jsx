import React from "react";
import AdminSideBar from "../Component/AdminSideBar";
import Box from "@mui/material/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AllData() {
  const [workLogs, setWorkLogs] = useState([]);

  const token = localStorage.getItem("token");
  let decodedToken = null;
  let userId = null;

  if (token) {
    decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
    console.log("decodedToken:", decodedToken);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchWorkLogs();
    }
  }, [token, navigate]);

  const fetchWorkLogs = async () => {
    try {
      const response = await axios.get("http://localhost:3001/work-log/all");
      setWorkLogs(response.data);
    } catch (error) {
      console.error("Error fetching worklogs:", error);
      toast.error("Error fetching worklogs");
    }
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

  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/work-log/export/all",
        {
          responseType: "blob", // Ensure the response is a Blob (binary data)
        }
      );

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", "worklogs.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Error downloading CSV");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadClick}
          sx={{ mt: 2, display: "block" }}
        >
          Download Worklogs
        </Button>
      </Box>
    </Box>
  );
}
