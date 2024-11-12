import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";
import halfImage from "../assets/login_background.png";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message for password mismatch

  const [customer, setCustomer] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    is_member: "0",
  });

  const [credentials, setCredentials] = useState({
    customer_id: 0,
    email: "",
    password: "",
  });

  const [checkpassword, setCheckPassword] = useState({
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update customer fields if the input name matches customer properties
    if (["first_name", "middle_initial", "last_name"].includes(name)) {
      setCustomer((prev) => ({ ...prev, [name]: value }));
    }

    // Update credentials fields if the input name matches credentials properties
    if (["customer_id", "email", "password"].includes(name)) {
      setCredentials((prev) => ({ ...prev, [name]: value }));
    }
    // Update checkpassword field if the input name matches checkpasswords properties
    if (["confirmPassword"].includes(name)) {
      setCheckPassword((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!customer.first_name || !customer.last_name || !credentials.email || !credentials.password || !checkpassword.confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (credentials.password !== checkpassword.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    } else {
      setErrorMessage(""); // Clear error if passwords match
    }

    try {
      // Post customer data
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer`,
        customer
      );

      // Retrieve the last customer to get the new customer ID
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/customer/last`
      );
      const lastCustomer = response.data;

      // Post to Authentication using the updated customer ID directly
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/authentication`, {
        ...credentials,
        customer_id: lastCustomer.customer_id,
      });
      setConfirmationMessage("Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log("Authentication error:", err);
      setConfirmationMessage("Registration failed.");
    }
  };

  console.log(customer);
  console.log(credentials);

  return (
    <>
      {/* Main Section with Flexbox Layout */}
      <div className="flex h-screen">
        {/* Left Half - Registration Form */}
        <div className="flex flex-col justify-center items-center w-1/2 bg-white shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Customer Registration</h2>
          <p className="text-center text-gray-600 text-sm mt-4">
            We're glad to have you! Please enter your details.
          </p>
          <form className="w-full max-w-lg mt-8 space-y-4">
            
            {/* Name Row */}
            <div className="flex space-x-4">
              {/* First Name */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2" htmlFor="first_name">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
  
              {/* Middle Initial */}
              <div className="w-20">
                <label className="block text-gray-700 text-sm mb-2" htmlFor="middle_initial">
                  M (optional)
                </label>
                <input
                  type="text"
                  name="middle_initial"
                  maxLength="1"
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
  
              {/* Last Name */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
  
            {/* Email Field */}
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
  
            {/* Password Field */}
            <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            
             {/* Re-enter Password Field */}
             <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
              Re-enter Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
  
            {/* Register Button */}
            <button
              className="w-full bg-gray-900 text-white p-3 rounded-md hover:bg-black transition duration-200 mt-6"
              onClick={handleClick}
            >
              Register
            </button>
          </form>
  
          {errorMessage && (
            <div className="mt-4 text-red-600 text-lg text-center">
              {errorMessage}
            </div>
          )}

          {/* Confirmation Message */}
          {confirmationMessage && (
            <div className="mt-4 text-green-600 text-lg text-center">
              {confirmationMessage}
            </div>
          )}
  
          {/* Login Message and Button */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg">Already have an account? Login here!</p>
            <NavLink to="/login">
              <button className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-black transition duration-200">
                Login
              </button>
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

export default SignupPage;