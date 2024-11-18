import Navbar from "../components/Navbar.jsx";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CollectionsViewPage = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [artPieces, setArtPieces] = useState([]);

  useEffect(() => {
    const fetchCollectionView = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/collection/${id}`
        );
        setCollection(response.data);

        // Fetch art pieces where collection_id matches
        const artResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/art/collection/${id}`
        );
        setArtPieces(artResponse.data);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      }
    };
    fetchCollectionView();
  }, [id]);

  if (!collection) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div>
      <Navbar />
      {/* Banner Section */}
      <div className="relative flex items-center w-screen h-[800px]">
        <img
          src={`${collection.image_path}`}
          alt="Collection Banner"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-8 space-y-4">
          <h1 className="text-8xl font-cavas text-white w-[900px] p-6">
            {collection.title}
          </h1>
          <p className="text-3xl font-thin text-white z-10 max-w-4xl">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Art Pieces Section */}
      <div className="container mx-auto pb-12">
        <h2 className="text-xl font-semibold mt-6 mb-4 px-8">
          Sample art pieces from this Collection
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
              <h3 className="text-2xl font-thin text-white absolute bottom-0 left-0 ml-4 mb-4 z-10">
                {art.art_title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsViewPage;
