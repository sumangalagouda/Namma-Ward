import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {

  const token = localStorage.getItem("token");

  // not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  // exp is in seconds; Date.now() is in milliseconds
  if (payload?.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  const userRole = payload.role;

  // role restriction
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}
