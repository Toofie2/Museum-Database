import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/authentication";
import NavbarBlack from "../components/NavbarBlack";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { userId } = useAuth();
  const [profileData, setProfileData] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    is_member: 0,
    membership_start_date: null,
  });
  const [editingProfile, setEditingProfile] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [authEmail, setAuthEmail] = useState(""); // State to store email from authentication
  const navigate = useNavigate();

  // Calculate membership expiration date by adding 12 months to membership_start_date
  const getMembershipExpirationDate = () => {
    if (profileData.membership_start_date) {
      const startDate = new Date(profileData.membership_start_date);
      const expirationDate = new Date(startDate);
      expirationDate.setMonth(startDate.getMonth() + 12);
      return expirationDate.toLocaleDateString();
    }
    return "N/A";
  };

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`);
      setProfileData(res.data);
      fetchAuthEmail(res.data.customer_id); // Fetch authentication email based on customer ID
    } catch (err) {
      console.log("Error fetching profile data:", err);
    }
  };

  // Fetch authentication email by customer ID
  const fetchAuthEmail = async (customerId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/authentication/customer${customerId}`);
      setAuthEmail(res.data.email); // Store the email from authentication
    } catch (err) {
      console.log("Error fetching authentication email:", err);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const handleEditClick = () => {
    setEditingProfile({ ...profileData });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`, editingProfile);
      setEditingProfile(null);
      fetchProfileData();

      setSaveMessage("Profile Updates Saved");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  const handleCancelClick = () => {
    setEditingProfile(null);
  };

  const handleEditReviewsClick = () => {
    navigate('/editreview');
  };

  const handlePurchaseHistoryClick = () => {
    navigate('/purchasehistory');
  };

  // Handle the account deletion
  const handleDeleteAccount = async () => {
    try {
      // Call the delete authentication and customer to deactivate the user
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/authentication/${authEmail}`);
      setShowDeleteConfirmation(false);
      navigate('/login');
    } catch (err) {
      console.log("Error deleting account:", err);
    }
  };

  // Show delete confirmation dialog
  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <NavbarBlack />
      <div className="relative flex items-center h-[75px] w-full mb-8">
        <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
      </div>

      <h1 className="text-4xl md:text-3xl font-bold text-black mb-4 text-center">Edit Profile</h1>

      {saveMessage && (
        <div className="text-green-600 font-semibold text-center mb-4">
          {saveMessage}
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        {!editingProfile ? (
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full md:w-3/4 lg:w-1/2">
            <h2 className="text-base text-black">First Name: {profileData.first_name}</h2>
            <p className="text-base text-black">M.I: {profileData.middle_initial}</p>
            <p className="text-base text-black">Last Name: {profileData.last_name}</p>
            <p className="text-base text-black">Membership Status: {profileData.is_member ? "Member" : "Non-member"}</p>
            <p className="text-base text-black">
              Membership Expiration Date: {getMembershipExpirationDate()}
            </p>
            <div className="flex flex-col items-center space-y-4 mt-4">
              <button
                onClick={handleEditClick}
                className="bg-gray-900 text-white px-6 py-3 rounded-md w-full md:w-1/2 lg:w-1/3 hover:bg-black transition duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleEditReviewsClick}
                className="bg-gray-900 text-white px-6 py-3 rounded-md w-full md:w-1/2 lg:w-1/3 hover:bg-black transition duration-200"
              >
                Edit Reviews
              </button>

              <button
                onClick={handlePurchaseHistoryClick}
                className="bg-gray-900 text-white px-6 py-3 rounded-md w-full md:w-1/2 lg:w-1/3 hover:bg-black transition duration-200"
              >
                Purchase History
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-md w-full md:w-1/2 lg:w-1/3 hover:bg-red-700 transition duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full md:w-3/4 lg:w-1/2">
            <h2 className="text-xl font-medium text-black">Edit Profile</h2>

            <label className="text-base text-gray-900">First Name</label>
            <input
              type="text"
              name="first_name"
              value={editingProfile.first_name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
            />

            <label className="text-base text-gray-900">M.I (optional)</label>
            <input
              type="text"
              name="middle_initial"
              maxLength="1"
              value={editingProfile.middle_initial}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
            />

            <label className="text-base text-gray-900">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={editingProfile.last_name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
            />

            <div className="flex flex-col items-center space-y-4 mt-4">
              <button
                onClick={handleSaveClick}
                className="bg-gray-900 text-white px-6 py-3 rounded-md w-full md:w-1/2 lg:w-1/3 hover:bg-black transition duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="bg-gray-400 text-white px-6 py-3 rounded-md w-full md:w-1/2 lg:w-1/3 hover:bg-gray-500 transition duration-200"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg font-semibold text-center mb-4">Are you sure you want to delete your account?</p>
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-6 py-2 rounded-md w-full hover:bg-red-700 transition duration-200"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-400 text-white px-6 py-2 rounded-md w-full hover:bg-gray-500 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfilePage;
