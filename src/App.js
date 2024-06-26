import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import Employee from "./Page/Employee";
import AllData from "./Page/AllData";
import Settings from "./Page/Settings";
import SignUp from "./Component/SignUp";
import LogIn from "./Component/LogIn";
import AdminDashboard from "./Component/AdminDashboard";
import DepartmentFrom from "./Component/DepartmentForm";
import DepartmentEdit from "./Component/DepartmentEdit";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn title="Log In" />} />
          <Route path="/SignUp" element={<SignUp title="Sign Up" />} />
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route path="/AdminDashboard" element={<AdminDashboard />}></Route>
          <Route path="/Employee" element={<Employee />}></Route>
          <Route path="/AllData" element={<AllData />}></Route>
          <Route path="/Departments" element={<Settings />}></Route>
          <Route path="/DepartmentForm" element={<DepartmentFrom />}></Route>
          <Route
            path="/edit-department/:id"
            element={<DepartmentEdit />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
