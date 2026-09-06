import { useEffect, useState } from "react";

import api from "../../services/api";

import Navbar from "../../components/common/Navbar";
const AdminDashboard = () => {
  

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsResponse, usersResponse, bookingsResponse] =
          await Promise.all([
            api.get("/admin/stats"),
            api.get("/admin/users"),
            api.get("/admin/bookings"),
          ]);

        setStats(statsResponse.data.stats);
        setUsers(usersResponse.data.users);
        setBookings(bookingsResponse.data.bookings);
      } catch (error) {
        console.error("Admin dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Monitor your marketplace.
        </p>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Users", stats?.users],
            ["Providers", stats?.providers],
            ["Services", stats?.services],
            ["Bookings", stats?.bookings],
            ["Revenue", `₹${stats?.revenue || 0}`],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">{title}</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Users */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Recent users
          </h2>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y">
              {users.slice(0, 8).map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.email}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {item.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bookings */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Recent bookings
          </h2>

          <div className="mt-5 space-y-4">
            {bookings.slice(0, 8).map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {booking.service?.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {booking.customer?.name} →{" "}
                      {booking.provider?.name}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-bold text-slate-900">
                      ₹{booking.totalPrice}
                    </p>

                    <p className="text-sm capitalize text-slate-500">
                      {booking.status.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;