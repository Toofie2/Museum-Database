import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import NavbarBlack from "../components/NavbarBlack";
import Footer from "../components/Footer";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [customers, setCustomers] = useState({});
  const [exhibits, setExhibits] = useState({});
  const [selectedExhibit, setSelectedExhibit] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

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
        const formattedReviews = res.data
          .filter((review) => review.is_active === 1)
          .map((review) => ({
            ...review,
            date_posted: new Date(review.date_posted),
          }));

        formattedReviews.sort((a, b) => b.date_posted - a.date_posted);

        const updatedReviews = formattedReviews.map((review) => ({
          ...review,
          date_posted: review.date_posted.toLocaleDateString(),
        }));

        setReviews(updatedReviews);
        console.log("Fetched reviews:", updatedReviews); // Debug log
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
    setCurrentPage(1);
  };

  // Filter reviews based on selected exhibit
  const filteredReviews = selectedExhibit
    ? reviews.filter((review) =>
        selectedExhibit === "general_experience"
          ? review.exhibit_id === null
          : review.exhibit_id === parseInt(selectedExhibit)
      )
    : reviews;

  // Get current reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  // Calculate total pages
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Debug logs
  console.log("Total reviews:", reviews.length);
  console.log("Filtered reviews:", filteredReviews.length);
  console.log("Current reviews:", currentReviews.length);
  console.log("Current page:", currentPage);
  console.log("Total pages:", totalPages);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarBlack />
      <div className="flex-grow px-8 pb-12">
        {/* Banner Section */}
        <div className="relative flex items-center h-[75px] w-full mb-8">
          <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex justify-between items-center mb-4">
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
            <option value="">All Reviews</option>
            <option value="general_experience">General Experience</option>
            {Object.entries(exhibits).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Reviews Title with Count */}
        <h1 className="text-4xl md:text-3xl font-bold text-black mb-4">
          Reviews ({filteredReviews.length})
        </h1>

        {/* Reviews List */}
        <div className="space-y-6 mb-8">
          {currentReviews && currentReviews.length > 0 ? (
            currentReviews.map((rev) => (
              <div
                key={rev.review_id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-medium text-black">
                  Title: {rev.title}
                </h2>
                <p className="text-base text-gray-900">Feedback: {rev.feedback}</p>
                <p className="text-base text-yellow-500">
                  {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                </p>
                <p className="text-base text-gray-900">
                  Customer: {customers[rev.customer_id] || "Unknown"}
                </p>
                <p className="text-base text-gray-900">
                  Exhibit:{" "}
                  {rev.exhibit_id ? exhibits[rev.exhibit_id] : "General Experience"}
                </p>
                <p className="text-base text-gray-900">
                  Date Posted: {rev.date_posted}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reviews found</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-8">
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === number
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReviewPage;