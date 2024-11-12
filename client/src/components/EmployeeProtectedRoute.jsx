import { useAuth } from "./authentication";
import { Navigate } from "react-router-dom";

const EmployeeProtectedRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();

  // Check if the user is authenticated and has the 'employee' role
  if (!isAuthenticated || role !== "employee") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default EmployeeProtectedRoute;