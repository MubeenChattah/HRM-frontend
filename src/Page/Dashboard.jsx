import React, { useEffect } from "react";
import SideBar from "../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  var token = localStorage.getItem("token");
  var decodedToken = jwtDecode(token);
  var userId = decodedToken.userId;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);
  const handleClick = async () => {
    try {
      const response = await axios.get(
        "http://ec2-54-162-176-154.compute-1.amazonaws.com:3001/work-log/checkin",
        {
          "ngrok-skip-browser-warning": true,
          Authorization: `Bearer${token}`,
        }
      );
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
          Check-In
        </Button>
      </Box>
    </Box>
  );
}
