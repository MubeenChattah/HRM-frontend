import React from "react";
import AdminSideBar from "./AdminSideBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { TextField } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DepartmentEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, departmentName, teamLeader } = location.state;
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
    if (!token && userType !== "Admin") {
      navigate("/");
    }
  }, [token, navigate]);

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      departmentName: departmentName || "",
      teamLeader: teamLeader || "",
    },
    onSubmit: async (values) => {
      try {
        await axios.patch(`http://localhost:3001/departments/${id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Department updated successfully");
        navigate("/Departments");
      } catch (errors) {
        console.log(errors);
        toast.error("Error updating department");
      }
    },
  });

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSideBar />
      <Box
        component="main"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mx: 45,
        }}
      >
        <Card sx={{ padding: "25px" }}>
          <React.Fragment>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <Typography
                  as="h1"
                  fontSize="28px"
                  fontweight="700"
                  mb="5px"
                  sx={{ textAlign: "center" }}
                >
                  <b>Edit Department</b>
                </Typography>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    mb: "10px",
                    display: "block",
                  }}
                >
                  Department name
                </Typography>
                <TextField
                  fullWidth
                  label=""
                  name="departmentName"
                  sx={{ width: "300px", mb: "10px" }}
                  value={values.departmentName}
                  onChange={handleChange}
                />
                <Typography
                  component="label"
                  sx={{
                    mb: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "block",
                  }}
                >
                  Team Lead name
                </Typography>
                <TextField
                  fullWidth
                  label=""
                  name="teamLeader"
                  sx={{ width: "300px", mb: "10px" }}
                  value={values.teamLeader}
                  onChange={handleChange}
                />
              </CardContent>
              <Box sx={{ display: "flex" }}>
                <Button type="submit" fullWidth>
                  Submit
                </Button>
              </Box>
            </form>
          </React.Fragment>
        </Card>
      </Box>
    </Box>
  );
}
