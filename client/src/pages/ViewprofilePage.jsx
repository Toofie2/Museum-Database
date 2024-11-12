import { useEffect, useState } from "react";
import NavbarBlack from "../components/NavbarBlack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/login_background.png";
import { useAuth } from "../components/authentication";

const ViewProfilePage = () => {
  const navigate = useNavigate();
  const { customerId } = useAuth();

  const [profileData, setProfileData] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    is_member: 0,
  });

  const [editableData, setEditableData] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
  });

  const [memberMessage, setmemberMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/customer/${customerId}`
        );
        const data = response.data;
        setProfileData(data);
        setEditableData(data);
        if(data.is_member === 1) {
            setmemberMessage("Member")
        }
        else {
            setmemberMessage("Non-member")
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
  }, [customerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/customer/${customerId}`,
        editableData
      );
      if (response.data.success) {
        setProfileData(editableData); // Update the profile data with the edited values
        setIsEditing(false); // Exit editing mode after saving
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <>
      <NavbarBlack />
      {/* Banner Section */}
      <div className="relative flex items-center h-[40px] w-full mb-8">
        <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
      </div>

      {/* Background with image on the sides only */}
      <div className="relative flex justify-center items-center min-h-[92.4vh] overflow-hidden">
        {/* Left and Right Sections with Background Image */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/6 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
          }}
        ></div>
        <div
          className="absolute right-0 top-0 bottom-0 w-1/6 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
          }}
        ></div>

        {/* Profile Form Section */}
        <div className="relative z-10 bg-white shadow-none rounded-lg p-12 max-w-4xl w-full mx-4 flex flex-col justify-center mb-0">
          <h2 className="text-2xl font-semibold text-center mb-6">View Profile</h2>

          {/* Profile Information */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-1">
                  <p className="font-semibold">First Name:</p>
                  <p>{profileData.first_name}</p>
                </div>
                <div className="w-20">
                  <p className="font-semibold">M.I:</p>
                  <p>{profileData.middle_initial}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Last Name:</p>
                  <p>{profileData.last_name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Membership Status:</p>
                <p>{memberMessage}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-black transition duration-200"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="first_name">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={editableData.first_name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="w-20">
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="middle_initial">
                    M (optional)
                  </label>
                  <input
                    type="text"
                    name="middle_initial"
                    maxLength="1"
                    value={editableData.middle_initial}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={editableData.last_name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-black transition duration-200"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProfilePage;
