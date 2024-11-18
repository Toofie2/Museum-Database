import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExhibitionViewPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [artPieces, setArtPieces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

  useEffect(() => {
    const fetchExhibitionView = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exhibition/${id}`);
        setExhibition(response.data);
        const artResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/art/exhibit/${id}`);
        setArtPieces(artResponse.data);
        const reviewResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review/exhibit/${id}`);
        const fetchedReviews = reviewResponse.data;
        const reviewsWithCustomer = await Promise.all(
          fetchedReviews.map(async (review) => {
            const customerResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/customer/${review.customer_id}`
            );
            return {
              ...review,
              first_name: customerResponse.data.first_name,
            };
          })
        );

        setReviews(reviewsWithCustomer);
      } catch (error) {
        console.error("Error fetching exhibition details:", error);
      }
    };

    fetchExhibitionView();
  }, [id]);

  if (!exhibition) return <div className="text-center mt-20">Loading...</div>;
  
  // Sort reviews by rating
  const sortedReviews = reviews.sort((a, b) => b.rating - a.rating);

  // Get current reviews for pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);

  // Calculate total pages
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="relative flex items-center h-[800px] w-screen">
          <img
            src={`${exhibition.image_path}`}
            alt="Exhibition Banner"
            className="w-full h-full object-cover absolute top-0 left-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-4 space-y-2">
            <h1 className="text-8xl font-cavas text-white w-[900px] p-6">
              {exhibition.name}
            </h1>
            <p className="text-3xl font-thin text-white w-[800px] p-6">
              {exhibition.description}
            </p>
          </div>
        </div>
        
        {/*Art pieces from the Exhibition*/}
        <h2 className="text-xl font-semibold mt-6 mb-4 pl-8">
          Sample art pieces from this Exhibition
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-8">
          {artPieces.map((art) => (
            <div
              key={art.art_id}
              className="h-[300px] art-item relative rounded-lg overflow-hidden"
            >
              <img
                src={`${art.art_image_path}`}
                alt={art.art_title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>
              <h3 className="text-2xl font-thin text-white absolute bottom-0 left-0 ml-4 mb-4">
                {art.art_title}
              </h3>
            </div>
          ))}
        </div>

        {/* Exhibition Review Section */}
        <div className="mt-12 px-8 pb-12">
          <h2 className="text-xl font-semibold mb-4">Exhibition Reviews ({sortedReviews.length})</h2>
          {currentReviews.length > 0 ? (
            <>
              <div className="space-y-6">
                {currentReviews.map((review, index) => {
                  const formattedDate = new Date(review.date_posted).toLocaleDateString("en-US");
                  return (
                    <div key={index} className="p-4 border rounded-lg shadow">
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                        <span className="ml-2 text-gray-500 text-sm">{formattedDate}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{review.title}</h3>
                      <p className="italic mb-1">"{review.feedback}"</p>
                      <p className="text-sm text-gray-600">- {review.first_name}</p>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
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
            </>
          ) : (
            <div>No reviews available for this exhibition.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExhibitionViewPage;