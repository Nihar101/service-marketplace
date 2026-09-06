import User from "../models/user.model.js";
import Review from "../models/review.model.js";


// Get all providers
export const getProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
      isActive: true,
    }).select("name email phone profileImage");

    const providersWithRatings = await Promise.all(
      providers.map(async (provider) => {
        const result = await Review.aggregate([
          {
            $match: {
              provider: provider._id,
            },
          },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
            },
          },
        ]);

        return {
          ...provider.toObject(),
          rating: result[0]?.averageRating || 0,
          totalReviews: result[0]?.totalReviews || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: providersWithRatings.length,
      providers: providersWithRatings,
    });
  } catch (error) {
    console.error("Get providers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch providers",
    });
  }
};


// Get single provider
export const getProviderById = async (req, res) => {
  try {
    const provider = await User.findOne({
      _id: req.params.id,
      role: "provider",
      isActive: true,
    }).select("name email phone profileImage");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    const reviews = await Review.find({
      provider: provider._id,
    })
      .populate("customer", "name profileImage")
      .sort({ createdAt: -1 });

    const rating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.status(200).json({
      success: true,
      provider: {
        ...provider.toObject(),
        rating,
        totalReviews: reviews.length,
        reviews,
      },
    });
  } catch (error) {
    console.error("Get provider error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch provider",
    });
  }
};