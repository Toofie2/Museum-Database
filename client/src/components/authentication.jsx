import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // Store user ID in state
  const [role, setRole] = useState(null); // Store user role (customer or employee/admin)
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data (userId and role) from localStorage on init
    const storedUserId = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("role");
    if (storedUserId && storedRole) {
      setIsAuthenticated(true);
      setUserId(storedUserId); // Set userId from localStorage
      setRole(storedRole); // Set role from localStorage
    }
  }, []);

  const login = (id, userRole) => {
    localStorage.setItem("authToken", id);
    localStorage.setItem("role", userRole); // Store the user role
    setUserId(id);
    setRole(userRole);
    setIsAuthenticated(true);

    // Navigate based on role
    if (userRole === "admin") {
      setTimeout(() => navigate("/admin"), 1500); // Navigate to admin page if role is admin
    } else if (userRole === "staff") {
      setTimeout(() => navigate("/employee"), 1500); // Navigate to employee page if role is employee
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role"); // Remove role from localStorage
    setUserId(null);
    setRole(null);
    setIsAuthenticated(false);
    navigate("/"); // Redirect to home page on logout
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
