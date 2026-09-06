import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";


// Create a booking
export const createBooking = async (req, res) => {
  try {
    const { provider, service, bookingDate, notes } = req.body;

    if (!provider || !service || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "Provider, service and booking date are required",
      });
    }

    const serviceData = await Service.findById(service);

    if (!serviceData || !serviceData.isActive) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const booking = await Booking.create({
      customer: req.user.userId,
      provider,
      service,
      bookingDate,
      notes,
      totalPrice: serviceData.basePrice,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email")
      .populate("provider", "name email")
      .populate("service", "title basePrice");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};


// Get customer's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user.userId,
    })
      .populate("provider", "name email")
      .populate("service", "title basePrice")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get customer bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};


// Get provider's bookings
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.user.userId,
    })
      .populate("customer", "name email phone")
      .populate("service", "title basePrice")
      .sort({ bookingDate: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get provider bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch provider bookings",
    });
  }
};


// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the assigned provider can update the booking
    if (booking.provider.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};