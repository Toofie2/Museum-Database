import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import halfImage from "../assets/login_background.png";

const SendResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
  
    if (!email) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/password-reset`,
        { email } // Send email in the request body
      );
  
      if (response.status === 200) {
        setConfirmationMessage("Password reset email sent! Please check your inbox.");
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage("Failed to send reset email. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorMessage("No user found with this email address.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      setConfirmationMessage(""); // Clear any previous success message
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Half - Reset Email Form */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
        <p className="text-center text-gray-600 text-base mt-1">
          Enter your email to receive a password reset link.
        </p>
        <form className="w-full max-w-sm mt-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            name="email"
            className="w-full p-3 mb-6 border border-gray-300 rounded-md"
          />
          <button
            className="w-full bg-gray-900 text-white p-3 rounded-md hover:bg-black transition duration-200"
            onClick={handleSendEmail}
          >
            Send Reset Email
          </button>
        </form>

        {/* Success Message */}
        {confirmationMessage && (
          <div className="mt-4 text-green-600 text-lg text-center">
            {confirmationMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 text-red-600 text-lg text-center">
            {errorMessage}
          </div>
        )}

        {/* Back to Login Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Back to Login
          </button>
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
  );
};

export default SendResetPasswordPage;
