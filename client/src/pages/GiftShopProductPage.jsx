import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GiftShopProductPage = () => {
  const { prodCatID, prodID } = useParams();
  //const [productCategory, setProductCategory] = useState(null);
  const [productInfo, setProductInfo] = useState([]);

  useEffect(() => {
    const fetchGiftShopProductInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/product/${prodID}`
        );
        setProductInfo(response.data);
      } catch (error) {
        console.error("Error fetching product information", error);
      }
    };
    fetchGiftShopProductInfo();
  }, [prodID]);

  if (!productInfo)
    return <div className="text-center mt-20">Loading...</div>;
  
  return (
    <div>
      <Navbar forceBlackText={true}/>
      <div className="container mx-auto pb-12 p-1 flex flex-row">
        <div className="w-[45rem] h-[40rem] border-2 border-black ml-20 mt-36">
        <img
            src={productInfo.image_path}
            alt={productInfo.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-[40rem] h-screen border-2 border-black ml-5 mt-36">
          <h1 className="text-2xl font-medium">
            {productInfo.name}
          </h1>
          <h2 className="text-2xl mt-4 text-default-gray">
            ${productInfo.price?.toFixed(2)}
          </h2>
          <p className="mt-10">
            {productInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiftShopProductPage;

/*<img
src={productInfo.image_path}
alt={productInfo.name}
className="object-scale-down"
/>*/


/*
<Navbar forceBlackText={true}/>
      <div className="container mx-auto pb-12 p-1">
        {/* Products Section *///}
        /*<h1 className="text-2xl content- font-medium mt-24 mb-4 flex justify-center items-center">
          {productCategory.name}
        </h1>
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-auto px-8">
          {products.map((p) => (
            <div className="static">
              <div
                key={p.product_id}
                className="h-[300px] art-item overflow-hidden hover:drop-shadow-md"
              >
                <img
                  src={`${p.image_path}`}
                  alt={p.name}
                  className="w-full h-full object-scale-down hover:cursor-pointer"
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
    </div>*/