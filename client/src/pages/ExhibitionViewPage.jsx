import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExhibitionViewPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [artPieces, setArtPieces] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchExhibitionView = async () => {
      try {
        // Fetch exhibition details
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/exhibition/${id}`
        );
        setExhibition(response.data);

        // Fetch art pieces for the exhibition
        const artResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/art/exhibit/${id}`
        );
        setArtPieces(artResponse.data);

        // Fetch reviews for the exhibition
        const reviewResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/review/exhibit/${id}`
        );
        console.log("Review Data:", reviewResponse.data); // Check the structure of the review data
        setReviews(reviewResponse.data);
        
      } catch (error) {
        console.error("Error fetching exhibition details:", error);
      }
    };

    fetchExhibitionView();
  }, [id]);

  if (!exhibition) return <div className="text-center mt-20">Loading...</div>;

  // Sort the reviews by rating, with the highest rating first
  const sortedReviews = reviews.sort((a, b) => b.rating - a.rating);

  return (
    <div className="mx-auto pb-12">
      <Navbar />
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
      <div className="mt-12 px-8">
        <h2 className="text-xl font-semibold mb-4">Exhibition Reviews</h2>
        {sortedReviews.length > 0 ? (
          <div className="space-y-6">
            {sortedReviews.map((review, index) => (
              <div key={index} className="p-4 border rounded-lg shadow">
                {/* Star Rating at the Top */}
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="text-lg font-bold mb-2">{review.title}</h3>

                {/* Review Feedback */}
                <p className="italic mb-1">"{review.feedback}"</p>

                {/* Reviewer Name */}
                <p className="text-sm text-gray-600">- {review.reviewer_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>No reviews available for this exhibition.</div>
        )}
      </div>
    </div>
  );
};

export default ExhibitionViewPage;