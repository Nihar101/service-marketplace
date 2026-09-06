import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-slate-900"
        >
          Service<span className="text-blue-600">Hub</span>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user.role === "customer" && (
                <Link
                  to="/my-bookings"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  My Bookings
                </Link>
              )}

              {user.role === "provider" && (
                <Link
                  to="/provider/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Dashboard
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Dashboard
                </Link>
              )}

              <span className="hidden text-sm text-slate-500 sm:block">
                {user.name}
              </span>

              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;