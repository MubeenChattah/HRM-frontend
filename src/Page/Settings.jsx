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
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Settings() {
  const [departments, setDepartments] = useState([]);

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
  return (
    <Box sx={{ display: "flex" }}>
      <AdminSideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Button variant="contained" color="primary" sx={{ mt: 1, mb: 1 }}>
          Create Department
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Team Lead</b>
                </TableCell>
                <TableCell>
                  <b>Department Name</b>
                </TableCell>
                <TableCell>
                  <b>Create/Delete Department</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.teamLeader}</TableCell>
                  <TableCell>{department.departmentName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
