import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CollectionsPage = () => {
  const [Collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/collection`
        );
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div className="mx-auto p-0">
      <Navbar />
      {/* Banner Section */}
      <div className="relative flex items-center h-[800px] w-full">
        <img
          src="https://i.ibb.co/Q9Wnq94/photo-1563292769-4e05b684851a.jpg" // Adjust to a suitable collection banner
          alt="Collections Banner"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-4 space-y-2">
          <h1 className="text-8xl font-regular text-white z-10 w-[600px] p-6">
            Collections
          </h1>
          <p className="text-3xl font-thin text-white z-10 w-[800px] p-6">
            Explore our diverse collections, featuring masterpieces from various
            artists and styles.
          </p>
        </div>
      </div>

      {/* Collections List */}
      <div className="container mx-auto p-7 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {Collections.map((collection) => (
            <div
              key={collection.collection_id}
              className="collection-item relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105"
            >
              <Link to={`/collection/${collection.collection_id}`}>
                <img
                  src={collection.image_path}
                  alt={collection.title}
                  className="w-full h-64 object-cover transition-transform duration-300 transform hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 ease-in-out hover:bg-opacity-40 flex items-end">
                  <h2 className="text-2xl font-thin text-white ml-4 mb-4">
                    {collection.title}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
