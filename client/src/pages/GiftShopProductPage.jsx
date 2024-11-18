import NavbarBlack from "../components/NavbarBlack.jsx";
import { useEffect, useState, useHistory } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SubtractIcon from "../components/SubtractIcon.jsx";
import AddIcon from "../components/AddIcon.jsx";
import { useAuth } from "../components/authentication";
import Footer from "../components/Footer.jsx";

const GiftShopProductPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({});
  const discountPercent = 0.15;
  const [showPopup, setShowPopup] = useState(false);
  const [showGoBackPopup, setShowGoBackPopup] = useState(false);

  const handleCloseGoBackPopup = () => {
    setShowGoBackPopup(false);
    if (
      (window.history?.length && window.history.length > 1) ||
      window.history.state?.idx
    ) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    const fetchCustomerInfo = async (userId) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`
        );
        setCustomerInfo(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomerInfo(userId);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };

  // Update form data whenever input changes. Don't allow values out of range
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (value > maxProduct) {
      value = maxProduct;
    } else if (value < 0) {
      value = 0;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Decrease ticket count by 1
  const handleDecrease = (e) => {
    e.preventDefault();
    let { name, value } = e.currentTarget;
    value--;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value >= maxProduct ? maxProduct : value <= 0 ? 0 : value,
    }));
  };

  // Increase ticket count by 1
  const handleIncrease = (e) => {
    e.preventDefault();
    let { name, value } = e.currentTarget;
    value++;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value >= maxProduct ? maxProduct : value <= 0 ? 0 : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/customer_product`, [
        {
          customer_id: userId,
          product_id: prodID,
          amount_spent: customerInfo.is_member
            ? subtotal - subtotal * discountPercent
            : subtotal,
          quantity: formData.quantity,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
    handleClosePopup();
    setShowGoBackPopup(true);
  };

  const handleSubtotal = (formData) => {
    setSubtotal(productInfo.price * formData.quantity);
  };

  const { prodCatID, prodID } = useParams();
  const [productInfo, setProductInfo] = useState([]);
  const [formData, setFormData] = useState({ quantity: 0 });
  const [subtotal, setSubtotal] = useState(0);
  const maxProduct = 20;

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

  if (!productInfo) return <div className="text-center mt-20">Loading...</div>;

  useEffect(() => {
    handleSubtotal(formData);
  }, [formData]);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div>
      <NavbarBlack />
      <div className="container mx-auto pb-12 p-1 flex flex-row">
        <div className="w-[45rem] h-[40rem] ml-20 mt-36">
          <img
            src={productInfo.image_path}
            alt={productInfo.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-[40rem] h-screen ml-5 mt-36">
          <h1 className="text-2xl font-medium">{productInfo.name}</h1>
          <h2 className="text-2xl mt-4 text-default-gray">
            ${productInfo.price?.toFixed(2)}
          </h2>
          <p className="mt-10">{productInfo.description}</p>
          <div className="mt-8 flex flex-row">
            <button
              name="quantity"
              value={formData.quantity}
              onClick={handleDecrease}
            >
              <SubtractIcon />
            </button>
            <form className="p-1">
              <input
                type="number"
                name="quantity"
                id="quantity"
                min="0"
                max={maxProduct}
                placeholder="0"
                value={formData.quantity || 0}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === ".") {
                    e.preventDefault();
                  } // Prevent decimal
                }}
                onInput={(e) => {
                  // Remove leading zeros
                  if (e.target.value[0] == "0" && e.target.value.length > 1) {
                    e.target.value = e.target.value.replace("0", "");
                  }
                  e.target.value = e.target.value.replace(/[^0-9]*/g, ""); // Do not allow "+" or "-"
                }}
                className="w-9 h-8 text-center"
              />
            </form>

            {/* Add a ticket */}
            <button
              name="quantity"
              value={formData.quantity}
              onClick={handleIncrease}
            >
              <AddIcon />
            </button>
          </div>
          <button
            className="w-full mt-4 bg-black text-white py-2 px-52 border-black rounded"
            onClick={() => {
              setShowPopup(true);
            }}
          >
            Purchase
          </button>
        </div>
      </div>
      {showPopup && (
        <div>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2 h-5/6 overflow-y-scroll">
              <h3 className="text-2xl">You are about to purchase:</h3>
              <div className="text-lg leading-loose mt-5">
                <div className="flex flex-row justify-between">
                  <p>
                    {productInfo.name} ({formData.quantity}x)
                  </p>
                  <p>${productInfo.price.toFixed(2)}</p>
                </div>
                <hr />
                <div className="flex flex-row justify-between text-default-gray">
                  <p>Subtotal:</p>
                  <p>${Number(subtotal).toFixed(2)}</p>
                </div>
                {Boolean(customerInfo.is_member) && (
                  <div className="text-default-gray">
                    <hr />
                    <div className="flex flex-row justify-between mt-1">
                      <p>Discount (Member, {discountPercent * 100}% off): </p>
                      <p className="text-red-600">
                        -${(subtotal * discountPercent).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
                <hr />
                <span className="font-bold mt-30">
                  Total: $
                  {customerInfo.is_member
                    ? (subtotal - subtotal * discountPercent).toFixed(2)
                    : Number(subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <button
                  onClick={handleClosePopup} // Close popup and trigger redirect
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit} // Close popup and trigger redirect
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showGoBackPopup && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="text-xl">Thank you for your purchase! <br/> (You can view your purchase history on your profile)</h3>
              <button
                onClick={handleCloseGoBackPopup} // Close popup and trigger redirect
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default GiftShopProductPage;
