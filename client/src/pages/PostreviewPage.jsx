import { useState } from "react";
import axios from "axios";
import NavbarBlack from "../components/NavbarBlack";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/postreview_background.png";
import { useAuth } from "../components/authentication";

const PostreviewPage = () => {
  const navigate = useNavigate();
  const { customerId } = useAuth();

  const [review, setReview] = useState({
    title: "",
    feedback: "",
    rating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update review fields if the input name matches review properties
    if (
      ["title", "feedback", "rating"].includes(
        name
      )
    ) {
      setReview((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!review.title || !review.feedback || !review.rating) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/review`, {
        ...review,
        customer_id: customerId,
        date_posted: today,
      });
      console.log(review, today);
      navigate("/review")
    } catch (err) {
      console.log("Review post error:", err);
    }
  };

  return (
    <>
      <NavbarBlack />
      {/* Banner Section */}
      <div className="relative flex items-center h-[40px] w-full mb-8">
        <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
      </div>
  
      {/* Background */}
      <div
        className="relative bg-cover bg-center flex justify-center items-center min-h-[92.4vh] overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
  
        {/* Form Section */}
        <div className="relative z-10 bg-white shadow-md rounded-lg p-12 max-w-6xl w-full mx-4 min-h-[0vh] flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center mb-6">Please describe your experience and leave a rating</h1>
          <form>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter review title"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg mb-2" htmlFor="feedback">
                Feedback
              </label>
              <textarea
                name="feedback"
                placeholder="Write your feedback"
                onChange={handleChange}
                rows="6"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg mb-2" htmlFor="rating">
                Rating
              </label>
              <select
                name="rating"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-black transition duration-200"
                onClick={handleClick}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostreviewPage;
