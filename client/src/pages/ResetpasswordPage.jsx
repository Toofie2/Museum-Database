import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import halfImage from "../assets/login_background.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetData, setResetData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To track error messages

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setResetData((prev) => ({ ...prev, token }));
    } else {
      setErrorMessage("Invalid or expired reset link.");
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetData.newPassword !== resetData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (resetData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Send POST request to validate token and reset password
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/password-reset/validate`,
        {
          token: resetData.token, // Pass the token
          password: resetData.newPassword, // New password entered by user
        }
      );

      if (response.data?.message === "Password reset successfully.") {
        setConfirmationMessage("Password has been successfully reset!");
        setTimeout(() => navigate("/login"), 3000); // Redirect after success
      } else {
        setErrorMessage("Error resetting password. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Invalid or expired reset link.");
      console.error("Reset password error:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Half - Reset Password Form */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 text-base mt-4">
          Enter your new password to reset your password.
        </p>
        <form className="w-full max-w-sm mt-8" onSubmit={handleResetPassword}>
          {/* New Password input */}
          <input
            type="password"
            placeholder="New Password"
            value={resetData.newPassword}
            onChange={handleChange}
            name="newPassword"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          />
          {/* Confirm Password input */}
          <input
            type="password"
            placeholder="Confirm New Password"
            value={resetData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            className="w-full p-3 mb-6 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-gray-900 text-white p-3 rounded-md hover:bg-black transition duration-200"
          >
            Reset Password
          </button>
        </form>

        {/* Display Confirmation or Error Message */}
        {confirmationMessage && (
          <div className="mt-4 text-green-600 text-lg text-center">
            {confirmationMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600 text-lg text-center">
            {errorMessage}
          </div>
        )}

        {/* Back to Login Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-black transition duration-200"
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

export default ResetPasswordPage;
