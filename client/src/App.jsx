import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import DashBoard from "./pages/DashBoard";
import LuuTru from "./pages/LuuTru";
import Tour from "./pages/Tour";
import DiChuyen from "./pages/DiChuyen";
import HoatDong from "./pages/HoatDong";
import ChuyenBay from "./pages/ChuyenBay";
import UserInfo from "./pages/UserInfo";
import AddTour from "./pages/AddTour"; 

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/tour" element={<Tour />} />
      <Route path="/chuyenbay" element={<ChuyenBay />} />
      <Route path="/luutru" element={<LuuTru />} />
      <Route path="/dichuyen" element={<DiChuyen />} />
      <Route path="/hoatdong" element={<HoatDong />} />
      <Route path="/userinfo" element={<UserInfo />} />
      <Route path="/add-tour" element={<AddTour />} /> 
    </Routes>
  );
}

export default App;
