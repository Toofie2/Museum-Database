import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerId, setCustomerId] = useState(null);  // Store customer_id in state
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve customer_id from localStorage on init
    const storedCustomerId = localStorage.getItem("authToken");
    if (storedCustomerId) {
      setIsAuthenticated(true);
      setCustomerId(storedCustomerId); // Set customer_id from localStorage
    }
  }, []);

  const login = (id) => {
    localStorage.setItem("authToken", id);
    setCustomerId(id);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setCustomerId(null);
    setIsAuthenticated(false);
    navigate("/"); // Redirect to home page on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, customerId, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

