import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { SignUpSchema } from "../schemas";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

const initialValues = {
  name: "",
  username: "",
  email_mobile: "",
  password: "",
  departmentId: "",
};

function SignUp(props) {
  const [departments, setDepartments] = React.useState([]);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const { values, errors, handleBlur, handleChange, touched, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: SignUpSchema,
      onSubmit: async (values, action) => {
        try {
          const response = await axios.post(
            "http://localhost:3001/auth/signup",
            {
              name: values.name,
              username: values.username,
              email_mobile: values.email_mobile,
              password: values.password,
              departmentId: values.departmentId,
            }
          );
          console.log(response.data);
          localStorage.setItem("token", response.data.accessToken);
          const token = localStorage.getItem("token");
          console.log(token);
          if (token) {
            action.resetForm();
            navigate("/");
          } else {
            console.log(errors);
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
                Name
              </Typography>
              <TextField
                fullWidth
                label="name"
                name="name"
                sx={{ mb: "10px", width: "300px" }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
              />
              {errors.name && touched.name ? (
                <p className="errors">{errors.name}</p>
              ) : null}
              <Typography
                component="label"
                sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  mb: "10px",
                  display: "block",
                }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                label="username"
                name="username"
                sx={{ mb: "10px", width: "300px" }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
              />
              {errors.username && touched.username ? (
                <p className="errors">{errors.username}</p>
              ) : null}
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
                component="label"
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
              <Typography
                component="label"
                sx={{
                  mb: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "block",
                }}
              >
                Department
              </Typography>
              <FormControl fullWidth sx={{ mb: "10px", width: "300px" }}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  id="department"
                  name="departmentId"
                  value={values.departmentId}
                  label="Department"
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.departmentName} - {department.teamLeader}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.departmentId && touched.departmentId ? (
                <p className="errors">{errors.departmentId}</p>
              ) : null}
            </CardContent>
            <Box sx={{ display: "flex" }}>
              <Button type="submit" fullWidth>
                Sign Up
              </Button>
            </Box>
          </form>
        </React.Fragment>
      </Card>
    </Box>
  );
}

SignUp.propTypes = {
  title: PropTypes.string.isRequired,
};
SignUp.defaultProps = {
  title: "Set title here",
};

export default SignUp;
