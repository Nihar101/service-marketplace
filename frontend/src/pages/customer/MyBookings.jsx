import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/common/Navbar";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  "in-progress": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/my");
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        setError(
          error.response?.data?.message || "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            My Bookings
          </h1>

          <p className="mt-2 text-slate-600">
            Track your service requests and bookings.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">📋</div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-slate-600">
              Find a service and book your first professional.
            </p>

            <Link
              to="/services"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Services
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm text-slate-500">
                    {booking.service?.category}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {booking.service?.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    Provider:{" "}
                    <span className="font-medium text-slate-900">
                      {booking.provider?.name}
                    </span>
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statusStyles[booking.status] ||
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {booking.status.replace("-", " ")}
                </span>
              </div>

              <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Date
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {new Date(booking.bookingDate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Price
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    ₹{booking.totalPrice}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Booked
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Your notes
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {booking.notes}
                  </p>
                </div>
              )}

              {booking.status === "completed" && (
                <div className="mt-5 border-t pt-5">
                  <p className="text-sm font-medium text-green-700">
                    ✓ Service completed
                  </p>

                  <Link
                    to={`/review/${booking._id}`}
                    className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Leave a review →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;