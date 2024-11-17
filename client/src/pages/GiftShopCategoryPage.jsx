import NavbarBlack from "../components/NavbarBlack.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const GiftShopCategoryPage = () => {
  const { prodCatID } = useParams();
  const [productCategory, setProductCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchGiftShopCategoryView = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product_category/${prodCatID}`
        );
        setProductCategory(response.data);

        // Fetch products in category
        const productResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product/product_category/${prodCatID}`
        );
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching product category:", error);
      }
    };
    fetchGiftShopCategoryView();
  }, [prodCatID]);

  if (!productCategory)
    return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarBlack/>
      <div className="container mx-auto pb-12 p-1 flex-grow">

        {/* Products Section */}
        <h1 className="text-2xl content- font-medium mt-24 mb-4 flex justify-center items-center">
          {productCategory.name}
        </h1>
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-auto px-8">
          {products.map((p) => (
            <div key={p.product_id} className="static">
              <div
                className="h-[300px] art-item overflow-hidden hover:drop-shadow-md"
              >
                <Link to={`/shop/${p.product_category_id}/${p.product_id}`}>
                  <img
                    src={`${p.image_path}`}
                    alt={p.name}
                    className="w-full h-full object-contain hover:cursor-pointer"
                  />
                </Link>
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
      <Footer />
    </div>
  );
};

export default GiftShopCategoryPage;