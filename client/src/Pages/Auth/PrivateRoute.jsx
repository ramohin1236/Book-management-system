import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role; // user / admin

    // Admin-only page, but user is NOT admin
    if (adminOnly && role !== "admin") {
      return <Navigate to="/" />;
    }

    // ✅ Admin can access everything
    // ✅ Normal users can access non-admin pages
    return <Outlet />;
  } catch (err) {
    return <Navigate to="/signin" />;
  }
};

export default PrivateRoute;
