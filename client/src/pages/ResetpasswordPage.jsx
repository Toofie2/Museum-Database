import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import halfImage from "../assets/login_background.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Check if email exists
      const emailCheckResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/email?email=${
          resetData.email
        }`
      );

      // Ensure we check for employee_id within the response structure
      const isEmployee = emailCheckResponse?.data?.employee_id;

      // Prevent resetting employee password
      if (isEmployee !== null && isEmployee !== undefined) {
        setConfirmationMessage("Cannot edit this user's password.");
        return;
      }

      // Check if passwords match
      if (resetData.newPassword !== resetData.confirmPassword) {
        setConfirmationMessage("Passwords do not match.");
        return;
      }

      // Update password
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/${resetData.email}`,
        {
          password: resetData.newPassword,
        }
      );

      if (response.data) {
        setConfirmationMessage("Password has been successfully reset!");
        setTimeout(() => navigate("/login"), 3000); // Redirect to login page after 3 seconds
      } else {
        setConfirmationMessage("Error resetting password. Please try again.");
      }
    } catch (err) {
      setConfirmationMessage("No user registered with this email.");
      console.log("Reset password error:", err);
    }
  };

  return (
    <>
      {/*<NavbarBlack />*/}
      <div className="flex h-screen">
        {/* Left Half - Reset Password Form */}
        <div className="flex flex-col justify-center items-center w-1/2 bg-white shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Reset Password
          </h2>
          <p className="text-center text-gray-600 text-base mt-4">
            Enter your email and new password to reset your password.
          </p>
          <form className="w-full max-w-sm mt-8">
            <input
              type="email"
              placeholder="Email"
              value={resetData.email}
              onChange={handleChange}
              name="email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="New Password"
              value={resetData.newPassword}
              onChange={handleChange}
              name="newPassword"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={resetData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              className="w-full p-3 mb-6 border border-gray-300 rounded-md"
            />
            <button
              className="w-full bg-gray-900 text-white p-3 rounded-md hover:bg-black transition duration-200"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </form>

          {/* Confirmation Message */}
          {confirmationMessage && (
            <div className="mt-4 text-green-600 text-lg text-center">
              {confirmationMessage}
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
    </>
  );
};

export default ResetPasswordPage;
