import { useAuth } from "../components/authentication";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [redirect, setRedirect] = useState(false); // Track whether to redirect

  useEffect(() => {
    // If the user is not authenticated, show the popup
    if (!isAuthenticated) {
      setShowPopup(true);
    }
  }, [isAuthenticated]); // Depend on isAuthenticated to trigger the effect

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
    setTimeout(() => {
      setRedirect(true); // Set redirect to true after popup is closed
    }, 100); // Give enough time for popup to close
  };

  // If the user is not authenticated, show the popup and then redirect
  if (!isAuthenticated) {
    if (redirect) {
      return <Navigate to="/login" replace />; // Redirect to login after popup
    }

    return (
      <>
        {showPopup && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="text-xl">Please login to access this page</h3>
              <button
                onClick={handleClosePopup} // Close popup and trigger redirect
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return children; // If authenticated, render the protected route
};

export default ProtectedRoute;