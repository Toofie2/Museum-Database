import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import NavbarBlack from "../components/NavbarBlack";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [customers, setCustomers] = useState({});
  const [exhibits, setExhibits] = useState({});
  const [selectedExhibit, setSelectedExhibit] = useState(""); // State for selected exhibit filter

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/customer`
        );
        const customerMap = res.data.reduce((acc, customer) => {
          acc[
            customer.customer_id
          ] = `${customer.first_name} ${customer.last_name}`;
          return acc;
        }, {});
        setCustomers(customerMap);
      } catch (err) {
        console.log("Error fetching customers:", err);
      }
    };

    const fetchExhibits = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/exhibition`
        );
        const exhibitMap = res.data.reduce((acc, exhibit) => {
          acc[exhibit.exhibit_id] = exhibit.name;
          return acc;
        }, {});
        setExhibits(exhibitMap);
      } catch (err) {
        console.log("Error fetching exhibits:", err);
      }
    };

    const fetchAllReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/review`
        );
        const formattedReviews = res.data.map((review) => ({
          ...review,
          date_posted: new Date(review.date_posted).toLocaleDateString(),
        }));
        setReviews(formattedReviews);
      } catch (err) {
        console.log("Error fetching reviews:", err);
      }
    };

    fetchCustomers();
    fetchExhibits();
    fetchAllReviews();
  }, []);

  const handleExhibitChange = (e) => {
    setSelectedExhibit(e.target.value);
  };

  // Filter reviews based on the selected exhibit
  const filteredReviews = selectedExhibit
    ? reviews.filter(
        (review) => review.exhibit_id === parseInt(selectedExhibit)
      )
    : reviews;

  return (
    <>
      <NavbarBlack />
      {/* Banner Section */}
      <div className="relative flex items-center h-[75px] w-full mb-8">
        <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
      </div>

      {/* Add New Review Button and Filter Dropdown */}
      <div className="flex justify-between items-center mx-8 mb-4">
        <NavLink to="/postreview">
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-black transition duration-200">
            Add New Review
          </button>
        </NavLink>
        <select
          value={selectedExhibit}
          onChange={handleExhibitChange}
          className="bg-white border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">All Exhibits</option>
          {Object.entries(exhibits).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Title with Count */}
      <h1 className="text-4xl md:text-3xl font-bold text-black mb-4 translate-x-6">
        Reviews ({filteredReviews.length})
      </h1>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.review_id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-medium text-black">
              Title: {rev.title}
            </h2>
            <p className="text-base text-gray-900">Feedback: {rev.feedback}</p>
            <p className="text-base text-gray-900">Rating: {rev.rating}</p>
            <p className="text-base text-gray-900">
              Customer: {customers[rev.customer_id] || "Unknown"}
            </p>
            <p className="text-base text-gray-900">
              Exhibit: {exhibits[rev.exhibit_id] || "Unknown"}
            </p>
            <p className="text-base text-gray-900">
              Date Posted: {rev.date_posted}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewPage;
