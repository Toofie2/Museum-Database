import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/authentication";
import NavbarBlack from "../components/NavbarBlack";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/postreview_background.png";

const EditProfilePage = () => {
  const { userId } = useAuth();
  const [profileData, setProfileData] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    is_member: 0,
  });
  const [editingProfile, setEditingProfile] = useState(null);
  const [saveMessage, setSaveMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`);
      setProfileData(res.data);
    } catch (err) {
      console.log("Error fetching profile data:", err);
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

      // Set success message and hide it after 3 seconds
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

  return (
    <>
      <NavbarBlack />
      <div className="relative flex items-center h-[75px] w-full mb-8">
        <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
      </div>

      <h1 className="text-4xl md:text-3xl font-bold text-black mb-4 text-center">Edit Profile</h1>

      {/* Success Message */}
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
    </>
  );
};

export default EditProfilePage;
