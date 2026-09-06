import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  "in-progress": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const ProviderDashboard = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      try {
        const response = await api.get("/bookings/provider");

        if (!cancelled) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load your bookings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      setError("");

      await api.patch(`/bookings/${bookingId}/status`, {
        status,
      });

      const response = await api.get("/bookings/provider");

      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Failed to update booking:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update booking status."
      );
    }
  };

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const earnings = bookings
    .filter((booking) => booking.status === "completed")
    .reduce(
      (total, booking) => total + booking.totalPrice,
      0
    );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-2xl font-bold text-slate-900"
          >
            Service<span className="text-blue-600">Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.name}
            </span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Provider Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Welcome, {user?.name}
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your service requests and bookings.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalBookings}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending requests
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingBookings}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedBookings}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Earnings
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              ₹{earnings}
            </p>
          </div>

        </div>

        {/* Bookings */}
        <section className="mt-10">

          <h2 className="text-2xl font-bold text-slate-900">
            Service requests
          </h2>

          <div className="mt-5 space-y-5">

            {bookings.length === 0 ? (

              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-slate-600">
                  You don't have any bookings yet.
                </p>
              </div>

            ) : (

              bookings.map((booking) => (

                <div
                  key={booking._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  {/* Top section */}
                  <div className="flex flex-col justify-between gap-4 md:flex-row">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-xl font-bold text-slate-900">
                          {booking.service?.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            statusStyles[booking.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {booking.status.replace("-", " ")}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        Customer:{" "}
                        <span className="font-medium text-slate-900">
                          {booking.customer?.name}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Email: {booking.customer?.email}
                      </p>

                      {booking.customer?.phone && (
                        <p className="mt-1 text-sm text-slate-600">
                          Phone: {booking.customer.phone}
                        </p>
                      )}

                    </div>

                    <div className="text-left md:text-right">

                      <p className="text-sm text-slate-500">
                        Service price
                      </p>

                      <p className="text-2xl font-bold text-slate-900">
                        ₹{booking.totalPrice}
                      </p>

                    </div>

                  </div>

                  {/* Details */}
                  <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Appointment
                      </p>

                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(
                          booking.bookingDate
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Customer notes
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {booking.notes || "No notes provided"}
                      </p>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3 border-t pt-5">

                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(
                              booking._id,
                              "accepted"
                            )
                          }
                          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Accept booking
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              booking._id,
                              "cancelled"
                            )
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            booking._id,
                            "in-progress"
                          )
                        }
                        className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                      >
                        Start service
                      </button>
                    )}

                    {booking.status === "in-progress" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            booking._id,
                            "completed"
                          )
                        }
                        className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Mark completed
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <span className="rounded-lg bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700">
                        ✓ Service completed
                      </span>
                    )}

                    {booking.status === "cancelled" && (
                      <span className="rounded-lg bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700">
                        Booking cancelled
                      </span>
                    )}

                  </div>

                </div>
              ))
            )}

          </div>
        </section>

      </main>
    </div>
  );
};

export default ProviderDashboard;