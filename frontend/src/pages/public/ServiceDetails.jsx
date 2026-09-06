import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/common/Navbar";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceResponse, providerResponse] = await Promise.all([
          api.get(`/services/${id}`),
          api.get("/providers"),
        ]);

        setService(serviceResponse.data.service);
        setProviders(providerResponse.data.providers);
      } catch (error) {
        console.error(error);
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      setError("Only customers can book services.");
      return;
    }

    setError("");
    setSuccess("");
    setBooking(true);

    try {
      await api.post("/bookings", {
        provider: selectedProvider,
        service: service._id,
        bookingDate,
        notes,
      });

      setSuccess("Booking created successfully!");
      setSelectedProvider("");
      setBookingDate("");
      setNotes("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to create booking."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Service information */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex h-72 items-center justify-center bg-slate-100 text-8xl">
                🔧
              </div>

              <div className="p-8">
                <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  {service.category}
                </span>

                <h1 className="mt-3 text-4xl font-bold text-slate-900">
                  {service.title}
                </h1>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-8 border-t pt-6">
                  <p className="text-sm text-slate-500">Starting price</p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    ₹{service.basePrice}
                  </p>
                </div>
              </div>
            </div>

            {/* Providers */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Available professionals
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {providers.map((provider) => (
                  <button
                    key={provider._id}
                    type="button"
                    onClick={() => setSelectedProvider(provider._id)}
                    className={`rounded-xl border bg-white p-5 text-left transition ${
                      selectedProvider === provider._id
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                        {provider.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {provider.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          ⭐ {provider.rating?.toFixed(1) || "New"} (
                          {provider.totalReviews || 0} reviews)
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Booking form */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Book this service
              </h2>

              {success && (
                <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleBooking} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select professional
                  </label>

                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">Choose a provider</option>

                    {providers.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name} — ⭐{" "}
                        {provider.rating?.toFixed(1) || "New"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date & time
                  </label>

                  <input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Describe the problem
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Tell the professional what you need..."
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Estimated price
                    </span>

                    <span className="font-bold text-slate-900">
                      ₹{service.basePrice}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {booking ? "Booking..." : "Book Service"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetails;