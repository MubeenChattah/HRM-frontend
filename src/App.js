import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import Product from "./Page/Product";
import AddProduct from "./Page/AddProduct";
import Settings from "./Page/Settings";
import SignUp from "./Component/SignUp";
import LogIn from "./Component/LogIn";
import AdminDashboard from "./Component/AdminDashboard";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn title="Log In" />} />
          <Route path="/SignUp" element={<SignUp title="Sign Up" />} />
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route path="/AdminDashboard" element={<AdminDashboard />}></Route>
          <Route path="/product" element={<Product />}></Route>
          <Route path="/addproduct" element={<AddProduct />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
