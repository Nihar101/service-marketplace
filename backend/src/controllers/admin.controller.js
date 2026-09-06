import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Booking from "../models/booking.model.js";

export const getAdminStats = async (req, res) => {
  try {
    const [users, providers, services, bookings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "provider" }),
      Service.countDocuments({ isActive: true }),
      Booking.countDocuments(),
    ]);

    const completedBookings = await Booking.find({
      status: "completed",
    }).select("totalPrice");

    const revenue = completedBookings.reduce(
      (total, booking) => total + booking.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        users,
        providers,
        services,
        bookings,
        revenue,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email")
      .populate("provider", "name email")
      .populate("service", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};