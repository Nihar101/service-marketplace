import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

const categories = [
  {
    title: "AC Repair",
    description: "Fast and reliable AC service",
    icon: "❄️",
  },
  {
    title: "Plumbing",
    description: "Fix leaks, pipes and more",
    icon: "🔧",
  },
  {
    title: "Home Cleaning",
    description: "Professional home cleaning",
    icon: "🧹",
  },
  {
    title: "Electrician",
    description: "Electrical repairs and installation",
    icon: "⚡",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar />
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Trusted local services
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Find trusted professionals for{" "}
              <span className="text-blue-600">every job.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Book reliable professionals for home repairs, cleaning,
              maintenance and more—all in one place.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/services"
                className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Browse Services
              </Link>

              <Link
                to="/register"
                className="rounded-lg border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600">WHAT WE OFFER</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Popular services
          </h2>

          <p className="mt-2 text-slate-600">
            Get skilled professionals for the jobs that matter.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              to="/services"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">{category.icon}</div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {category.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {category.description}
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-400">HOW IT WORKS</p>

            <h2 className="mt-2 text-3xl font-bold">
              Get your problem solved in 3 steps
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                "Choose a service",
                "Browse the service you need and find a suitable professional.",
              ],
              [
                "02",
                "Book a professional",
                "Pick a provider, date and time that works for you.",
              ],
              [
                "03",
                "Get it done",
                "Your professional completes the job. Rate the service afterward.",
              ],
            ].map(([number, title, description]) => (
              <div key={number}>
                <div className="text-4xl font-bold text-blue-400">{number}</div>

                <h3 className="mt-4 text-xl font-semibold">{title}</h3>

                <p className="mt-3 leading-7 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-blue-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to get something fixed?</h2>

          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Find the right professional and book your service in minutes.
          </p>

          <Link
            to="/services"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Find a Service
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
