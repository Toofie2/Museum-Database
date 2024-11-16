import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./authentication";

const UserProfile = () => {
  const { userId, role } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/employee/${userId}`
        );
        setUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-sm text-gray-dark">Loading...</span>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-light flex items-center justify-center">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Unknown User</span>
          <span className="text-sm text-gray-dark">{role || "No role"}</span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to="/employee/profile"
      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full bg-gray-light flex items-center justify-center">
        <span className="material-symbols-outlined">person</span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium">
          {userInfo.first_name} {userInfo.middle_initial} {userInfo.last_name}
        </span>
        <span className="text-sm text-gray-dark">{userInfo.role}</span>
      </div>
    </Link>
  );
};

export default UserProfile;
