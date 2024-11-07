import { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import NavbarBlack from "../components/NavbarBlack";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/customer`
        );
        const customerMap = res.data.reduce((acc, customer) => {
          acc[customer.customer_id] = `${customer.first_name} ${customer.last_name}`;
          return acc;
        }, {});
        setCustomers(customerMap);
      } catch (err) {
        console.log("Error fetching customers:", err);
      }
    };
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/review`
        );
        // Format the date to show only date for each review item
        const formattedReviews = res.data.map(review => ({
            ...review,
            date_posted: new Date(review.date_posted).toLocaleDateString()
        }));
        setReviews(formattedReviews);
        console.log(res);
      } catch (err) {
        console.log("Error fetching reviews:", err);
      }
    };
    fetchCustomers();
    fetchAllReviews();
  }, []);

  return (
    <>
      <NavbarBlack />
      {/* Banner Section */}
      <div className="relative flex items-center h-[75px] w-full mb-8">
        <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4">
        </div>
      </div>
        {/* Button to Add New Review */}
      <div className="flex justify-center mt-8">
        <NavLink to="/postreview">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200">
            Add New Review
          </button>
        </NavLink>
      </div>
      {/* Reviews Title */}
      <h1 className="text-5xl md:text-5xl font-bold text-black mb-4 translate-x-6">
        Reviews
      </h1>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((rev) => (
          <div
            key={rev.review_id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-medium text-black">
              Title: {rev.title}
            </h2>
            <p className="text-base text-gray-900">Feedback: {rev.feedback}</p>
            <p className="text-lg text-gray-900">Rating: {rev.rating}</p>
            <p className="text-base text-gray-900">
             {customers[rev.customer_id] || "Unknown"}
            </p>
            <p className="text-sm text-gray-900">
              Date Posted: {rev.date_posted}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewPage;
