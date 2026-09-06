import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";

// Create a review
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and rating are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the customer who made the booking can review it
    if (booking.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot review this booking",
      });
    }

    // Review only after service completion
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review only completed bookings",
      });
    }

    // One review per booking
    const existingReview = await Review.findOne({
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      booking: bookingId,
      customer: booking.customer,
      provider: booking.provider,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

// Get reviews for a provider
export const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId,
    })
      .populate("customer", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get provider reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};