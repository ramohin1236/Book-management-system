import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/signin" />;

  try {
    const decoded = jwtDecode(token);

    // ✅ Check for admin access
    if (adminOnly && decoded.role !== "admin") {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  } catch (err) {
    return <Navigate to="/signin" />;
  }
};

export default PrivateRoute;
