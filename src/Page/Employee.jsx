import React from "react";
import AdminSideBar from "../Component/AdminSideBar";
import Box from "@mui/material/Box";
import axios from "axios";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Employee() {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [workLogs, setWorkLogs] = useState([]);

  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  let decodedToken = null;
  let userId = null;

  if (token) {
    decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
    console.log("decodedToken:", decodedToken);
  }
  const navigate = useNavigate();
  useEffect(() => {
    if (token && userType === "Admin") {
      fetchDepartments();
    } else {
      navigate("/");
    }
  }, [token, navigate]);
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  const fetchUsersByDepartment = async (departmentId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/team",
        { departmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchWorkLogsByUser = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/work-log/team-member",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkLogs(response.data);
    } catch (error) {
      console.error("Error fetching work logs:", error);
    }
  };

  const handleDepartmentChange = (event) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    fetchUsersByDepartment(departmentId);
  };

  const handleUserChange = (event) => {
    const userId = event.target.value;
    const selectedUser = users.find((user) => user.userId === userId);
    console.log("User ID:", userId);
    setSelectedUser(selectedUser);
    fetchWorkLogsByUser(userId);
  };

  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/work-log/export/all?user=${selectedUser.name}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", `${selectedUser.name}_worklogs.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.removeChild();
    } catch (error) {
      console.error("Error downloading CSV:", error);
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
  return (
    <Box sx={{ display: "flex" }}>
      <AdminSideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ display: "flex" }}>
          <Box>
            <FormControl fullWidth sx={{ mb: "10px", width: "500px" }}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                label="Department"
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.departmentName} - {department.teamLeader}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mx: "10px" }}>
            {selectedDepartment && (
              <FormControl fullWidth sx={{ mb: "10px", width: "500px" }}>
                <InputLabel id="user-label">User</InputLabel>
                <Select
                  labelId="user-label"
                  value={selectedUser.userId}
                  label="Users"
                  onChange={handleUserChange}
                >
                  {users.map((user) => (
                    <MenuItem key={user.userId} value={user.userId}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
        <Box>
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
    </Box>
  );
}
