import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Services from "../pages/public/Services";
import ServiceDetails from "../pages/public/ServiceDetails";
import MyBookings from "../pages/customer/MyBookings";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import Review from "../pages/customer/Review";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/review/:bookingId" element={<Review />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
