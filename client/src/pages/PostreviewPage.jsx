import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const PostreviewPage = () => {
  const navigate = useNavigate();

  const [review, setReview] = useState({
    customer_id: "1",
    title: "",
    feedback: "",
    rating: "",
    date_posted: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update review fields if the input name matches review properties
    if (
      ["customer_id", "title", "feedback", "rating", "date_posted"].includes(
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
      setReview((prev) => ({ ...prev, date_posted: today }));

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/review`, review);
      navigate("/review");
    } catch (err) {
      console.log("Review post error:", err);
    }
  };

  console.log(review);

  return (
    <div className="container mx-auto pb-12 px-4">
      <Navbar />
      {/* Banner Section */}
      <div className="relative flex items-center h-[75px] w-full mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-4"></div>
      </div>

      {/* Form Section */}
      <h1 className="text-4xl font-bold text-center mb-4">Post a Review</h1>
      <form className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter review title"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg mb-2"
            htmlFor="feedback"
          >
            Feedback
          </label>
          <textarea
            name="feedback"
            placeholder="Write your feedback"
            onChange={handleChange}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="rating">
            Rating
          </label>
          <select
            name="rating"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={handleClick}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostreviewPage;
