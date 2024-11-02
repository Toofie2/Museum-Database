import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GiftShopCategoryPage = () => {
  const { id } = useParams();
  const [productCategory, setProductCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchGiftShopCategoryView = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product_category/${id}`
        );
        setProductCategory(response.data);

        // Fetch products in category
        const productResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product/product_category/${id}`
        );
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching produc t category:", error);
      }
    };
    fetchGiftShopCategoryView();
  }, [id]);

  if (!productCategory)
    return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="container mx-auto pb-12 p-1">
      <Navbar />

      {/* Products Section */}
      <h1 className="text-2xl content- font-medium mt-24 mb-4 flex justify-center items-center">
        {productCategory.name}
      </h1>
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-8">
        {products.map((p) => (
          <div className="static">
            <div
              key={p.product_id}
              className="h-[300px] art-item overflow-hidden hover:drop-shadow-md"
            >
              <img
                src={`${p.image_path}`}
                alt={p.name}
                className="w-full h-full object-scale-down"
              />
            </div>

            <h3 className="text-[16px] font-medium text-black pl-8 mt-2">
              {p.name}
            </h3>
            <p className="text-[18px] font-medium text-default-gray pl-8 mt-1">
              ${p.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftShopCategoryPage;
