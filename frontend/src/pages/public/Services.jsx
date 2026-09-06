import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/common/Navbar";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.services);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Services
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            What do you need help with?
          </h1>

          <p className="mt-3 text-slate-600">
            Choose a service and find a professional for the job.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!error && services.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">No services available yet.</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service._id}
              to={`/services/${service._id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-48 items-center justify-center bg-slate-100 text-6xl">
                🔧
              </div>

              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {service.category}
                </span>

                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  {service.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-900">
                    From ₹{service.basePrice}
                  </p>

                  <span className="font-semibold text-blue-600 group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Services;