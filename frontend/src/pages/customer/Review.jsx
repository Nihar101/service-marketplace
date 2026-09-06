import { useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/common/Navbar";
const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/reviews", {
        bookingId,
        rating,
        comment,
      });

      setSuccess("Review submitted successfully!");

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1200);
    } catch (error) {
      console.error("Review error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />

      <main className="flex justify-center px-6 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="text-5xl">⭐</div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Rate your service
            </h1>

            <p className="mt-2 text-slate-600">
              How was your experience with the professional?
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8">
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Rating
              </label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-4xl transition ${
                      star <= rating
                        ? "text-yellow-400"
                        : "text-slate-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {rating} out of 5
              </p>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Comment
              </label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder="Tell us about your experience..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {comment.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Review;