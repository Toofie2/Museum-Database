import { useEffect, useState } from "react";
import axios from "axios";
import NavbarBlack from "../components/NavbarBlack";
import { useAuth } from "../components/authentication";

const EditReviewPage = () => {
  const { userId } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [exhibits, setExhibits] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [notification, setNotification] = useState(""); // State for the notification

  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exhibition`);
        const exhibitMap = res.data.reduce((acc, exhibit) => {
          acc[exhibit.exhibit_id] = exhibit.name;
          return acc;
        }, {});
        setExhibits(exhibitMap);
      } catch (err) {
        console.log("Error fetching exhibits:", err);
      }
    };

    const fetchCustomerReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/review/customer/${userId}`
        );
        const formattedReviews = res.data.map((review) => ({
          ...review,
          date_posted: new Date(review.date_posted),
        }));

        // Sort reviews by the most recent date
        formattedReviews.sort((a, b) => b.date_posted - a.date_posted);

        // Convert the date back to a readable format
        const updatedReviews = formattedReviews.map((review) => ({
          ...review,
          date_posted: review.date_posted.toLocaleDateString(),
        }));

        setReviews(updatedReviews);
      } catch (err) {
        console.log("Error fetching reviews:", err);
      }
    };

    fetchExhibits();
    fetchCustomerReviews();
  }, [userId]);

  const handleEditClick = (review) => {
    setEditingReview({ ...review });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const { date_posted, ...reviewDataToSave } = editingReview;

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/review/${editingReview.review_id}`,
        reviewDataToSave
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === editingReview.review_id ? editingReview : review
        )
      );
      setEditingReview(null); // Exit editing mode

      // Show the "Review Saved" notification
      setNotification("Review Saved");

      // Hide the notification after 2 seconds
      setTimeout(() => {
        setNotification(""); // Clear the notification
      }, 2000);
    } catch (err) {
      console.log("Error updating review:", err);
    }
  };

  const handleDeleteClick = async (reviewId) => {
    // Confirm with the user before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/review/${reviewId}`);

        // Remove the review from the state (soft delete)
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.review_id !== reviewId)
        );
      } catch (err) {
        console.log("Error deleting review:", err);
      }
    }
  };

  return (
    <>
      <NavbarBlack />
      {/* Banner Section */}
      <div className="relative flex items-center h-[75px] w-full mb-8">
        <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
      </div>
      <h1 className="text-4xl md:text-3xl font-bold text-black mb-4 translate-x-6">
        Your Reviews ({reviews.length})
      </h1>

      {/* Notification Section */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md">
          {notification}
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((rev) => (
          <div key={rev.review_id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            {editingReview && editingReview.review_id === rev.review_id ? (
              <>
                <p className="text-base text-gray-900">Title</p>
                <input
                  type="text"
                  name="title"
                  value={editingReview.title}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-4 py-2 mb-2 w-1/2"
                />
                <p className="text-base text-gray-900">Feedback</p>
                <textarea
                  name="feedback"
                  value={editingReview.feedback}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-4 py-2 mb-2 w-1/2"
                ></textarea>
                <p className="text-base text-gray-900">Rating</p>
                <select
                  name="rating"
                  value={editingReview.rating}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-4 py-2 mb-2 w-1/8"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleSaveClick}
                    className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-black transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingReview(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium text-black">Title: {rev.title}</h2>
                <p className="text-base text-gray-900">Feedback: {rev.feedback}</p>
                <p className="text-base text-gray-900">Rating: {rev.rating}</p>
                <p className="text-base text-gray-900"> Exhibit: {rev.exhibit_id === null || rev.exhibit_id === 0 ? "General Admission" : exhibits[rev.exhibit_id] || "Unknown"}</p>
                <p className="text-base text-gray-900">Date Posted: {rev.date_posted}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleEditClick(rev)}
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-black transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(rev.review_id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default EditReviewPage;
