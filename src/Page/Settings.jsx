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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
export default function Settings() {
  const [departments, setDepartments] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

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

  const handleCreateDepartment = () => {
    navigate("/DepartmentForm");
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDelButton = (id) => {
    setDepartmentToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${backendUrl}/departments/${departmentToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Department deleted successfully");
      fetchDepartments(); // Refresh the departments list after deletion
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Error deleting department");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setDepartmentToDelete(null);
  };

  const handleEditButton = (department) => {
    navigate(`/edit-department/${department.id}`, {
      state: {
        id: department.id,
        departmentName: department.departmentName,
        teamLeader: department.teamLeader,
      },
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Button
          onClick={handleCreateDepartment}
          variant="contained"
          color="primary"
          sx={{ mt: 1, mb: 1 }}
        >
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
                  <b>Edit/Delete Department</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.teamLeader}</TableCell>
                  <TableCell>{department.departmentName}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditButton(department)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      sx={{ mx: 2 }}
                      onClick={() => handleDelButton(department.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContent dividers>
            Are you sure you want to delete this department?
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
