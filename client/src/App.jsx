import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import DashBoard from "./pages/DashBoard";
import UserInfo from "./pages/UserInfo";
import ForgotPass from "./pages/ForgotPass";

import Tour from "./pages/Tour";
import TourDetailPage from "./pages/TourDetailPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import AddTour from "./pages/AddTour";
import EditTour from "./pages/EditTour";
import ManageTours from "./pages/ManageTours";
import AdminBP from "./pages/AdminBP";

import EventPage from "./pages/Event";
import AddEvent from "./pages/addEvent";
import ManageEvent from "./pages/ManageEvent";
import EditEvent from "./pages/EditEvent";

import HotelPage from "./pages/HotelPage";
import ManageHotels from "./pages/ManageHotels";
import EditHotel from "./pages/EditHotel";
import AddHotel from "./pages/AddHotel";

import ManageUsers from "./pages/ManageUser";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<DashBoard />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpass" element={<ForgotPass />} />

      <Route path="/tour" element={<Tour />} />
      <Route path="/tour/:tourId" element={<TourDetailPage />} />
      <Route
        path="/bookingconfirmation/:bookingId"
        element={<BookingConfirmationPage />}
      />
      <Route path="/hotel" element={<HotelPage />} />
      <Route path="/event" element={<EventPage />} />
      <Route path="/userinfo" element={<UserInfo />} />

      <Route path="/admin">
        <Route path="manage-tours" element={<ManageTours />} />
        <Route path="add-tour" element={<AddTour />} />
        <Route path="edit-tour/:id" element={<EditTour />} />
        <Route path="manage-bookings" element={<AdminBP />} />

        <Route path="manage-events" element={<ManageEvent />} />
        <Route path="add-event" element={<AddEvent />} />
        <Route path="edit-event/:id" element={<EditEvent />} />

        <Route path="manage-hotels" element={<ManageHotels />} />
        <Route path="add-hotel" element={<AddHotel />} />
        <Route path="edit-hotel/:id" element={<EditHotel />} />

        <Route path="manage-users" element={<ManageUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
