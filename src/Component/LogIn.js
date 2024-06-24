import * as React from "react";
import "../App.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LogInSchema } from "../schemas";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const initialValues = {
  email_mobile: "",
  Password: "",
};

function LogIn(props) {
  const token = localStorage.getItem("token");
  let decodedToken = null;
  let userType = null;

  if (token) {
    decodedToken = jwtDecode(token);
    userType = decodedToken.userType;
    console.log("decodedToken:", decodedToken);
  }

  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/SignUp");
  };
  const { values, errors, handleBlur, handleChange, touched, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: LogInSchema,
      onSubmit: async (values, action) => {
        try {
          const response = await axios.post(
            "http://localhost:3001/auth/login",
            {
              email_mobile: values.email_mobile,
              password: values.password,
            }
          );
          console.log(response.data);
          localStorage.setItem("token", response.data.token.access_token);
          const token = localStorage.getItem("token");
          console.log(token);
          if (token && userType === "Admin") {
            action.resetForm();
            navigate("/AdminDashboard");
          } else {
            action.resetForm();
            navigate("Dashboard");
          }
        } catch (errors) {
          console.log(errors);
        }
      },
    });

  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
                <b>{props.title}</b>
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
                Email
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                name="email_mobile"
                autoComplete="email"
                sx={{ width: "300px", mb: "10px" }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email_mobile}
              />
              {errors.email_mobile && touched.email_mobile ? (
                <p className="errors">{errors.email_mobile}</p>
              ) : null}

              <Typography
                cmponent="label"
                sx={{
                  mb: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "block",
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="Password"
                autoComplete="new-password"
                sx={{ width: "300px", mb: "10px" }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
              />
              {errors.password && touched.password ? (
                <p className="errors">{errors.password}</p>
              ) : null}
            </CardContent>
            <Box sx={{ display: "flex" }}>
              <Button type="submit" fullWidth>
                Log In
              </Button>
              <Button type="submit" fullWidth onClick={handleSignUp}>
                Sign Up
              </Button>
            </Box>
          </form>
        </React.Fragment>
      </Card>
    </Box>
  );
}

LogIn.propTypes = {
  title: PropTypes.string.isRequired,
};
LogIn.defaultProps = {
  title: "Set title here",
};

export default LogIn;
