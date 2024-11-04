import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/gift_shop_background.jpg";

const GiftShopPage = () => {
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product_category`
        );
        setProductCategories(response.data);
      } catch (error) {
        console.error("Error fetching product categories:", error);
      }
    };
    fetchProductCategories();
  }, []);

  return (
    <div className="mx-auto p-0">
      <Navbar />
      {/* Banner Section */}
      <div className="relative flex items-center h-[800px] w-screen">
        <img
          src={backgroundImage}
          alt="Gift Shop Banner"
          className="object-cover absolute top-0 left-0 h-full w-screen"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-10 space-y-2">
          <h1 className="text-8xl font-regular font-cavas text-white z-10 w-[600px] p-6">
            THE GIFT <br /> SHOP
          </h1>
          <p className="text-3xl font-thin text-white z-10 w-[800px] p-6">
            Browse our newest arrivals, art prints, jewelry, supplies, and more.
            <br />
            Visit our on-site gift shop to find your perfect souvenir.
          </p>
        </div>
      </div>

      {/* Product Category List */}
      <div className="container mx-auto py-7 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 w-auto px-5">
          {productCategories.map((PC) => {
            return (
              <div
                key={PC.product_category_id}
                className="gift-shop-category-item relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 w-auto"
              >
                <Link to={`/giftshop/${PC.product_category_id}`}>
                  <img
                    src={PC.image_path}
                    alt={PC.name}
                    className="w-full h-64 object-cover transition-transform duration-300 transform hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 ease-in-out hover:bg-opacity-40 flex items-end">
                    <h2 className="text-2xl font-thin text-white ml-4 mb-4">
                      {PC.name}
                    </h2>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GiftShopPage;
