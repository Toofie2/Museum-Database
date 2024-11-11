import { useState } from "react";
import NavbarBlack from "../components/NavbarBlack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import halfImage from "../assets/login_background.png";
import { useAuth } from "../components/authentication";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();  // Update authentication status

  const [loginData, setLogin] = useState({
    email: "",
    password: "",
  });

  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["email", "password"].includes(name)) {
      setLogin((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/email?email=${loginData.email}`
      );
      if (response.data.password === loginData.password) {
        const customer_id = response.data.customer_id;
        console.log("Customer ID:",response.data.customer_id)
        // Use login to set customer_id to later store in authentication component
        login(customer_id); // Login successful
        setConfirmationMessage("Login successful!");
        setTimeout(() => navigate("/"), 1500); // Redirect to home page after login
      } else {
        setConfirmationMessage("Login failed. Please try again.");
      }
    } catch (err) {
      setConfirmationMessage("Login failed. Please try again.");
      console.log("Authentication credentials retrieval error:", err);
    }
  };

  console.log(loginData);

  return (
    <>
      {/*<NavbarBlack />*/}
      {/* focus:ring focus:ring-blue-300 */}
      {/* Main Section with Flexbox Layout */}
      <div className="flex h-screen">
  
        {/* Left Half - Login Form */}
        <div className="flex flex-col justify-center items-center w-1/2 bg-white shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          {/* Welcome Message */}
          <p className="text-center text-gray-600 text-base mt-1">
            Welcome back! Please login to your account.
          </p>
          <form className="w-full max-w-sm mt-8">
            <input
              type="text"
              placeholder="Email"
              onChange={handleChange}
              name="email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              className="w-full p-3 mb-6 border border-gray-300 rounded-md"
            />
            <button
              className="w-full bg-gray-900 text-white p-3 rounded-md hover:bg-black transition duration-200"
              onClick={handleClick}
            >
              Login
            </button>
          </form>
          
          {/* Conditional rendering for confirmation message */}
          {confirmationMessage && (
            <div className="mt-4 text-green-600 text-lg text-center">
              {confirmationMessage}
            </div>
          )}
          
          {/* Sign-up Message and Button */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg">Don't have an account? Sign up now!</p>
            <NavLink to="/signup">
              <button className="mt-4 bg-gray-300 text-gray-800 px-20 py-3 rounded-md hover:bg-gray-400 transition duration-200">
                Sign Up
              </button>
            </NavLink>
          </div>
          {/* Reset Password */}
          <div className="mt-8 text-center">
           <NavLink to="/resetpassword">
            <p className="text-gray-600 text-sm hover:underline cursor-pointer">
              Forgot your password? Click here to reset
            </p>
          </NavLink>
          </div>
        </div>
  
        {/* Right Half - Background Image */}
        <div
          className="w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url(${halfImage})`,
          }}
        ></div>
      </div>
    </>
  );
};

export default LoginPage;

