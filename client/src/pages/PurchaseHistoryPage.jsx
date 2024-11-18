import { Outlet } from "react-router-dom";
import PurchaseHistoryNavbar from "../components/PurchaseHistoryNavbar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import AddItemModal from "../components/AddItemModal";

const PurchaseHistoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleClickProfile = () => {
    navigate('/profile')
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl">Purchase History</h1>
        <button
          onClick={handleClickProfile}
          className="flex bg-gray-900 text-white px-6 py-3 rounded-md  hover:bg-black transition duration-200"
        >
          Profile
        </button>
      </div>
      <PurchaseHistoryNavbar section="purchasehistory" />
      <main className="p-8">
        <Outlet
          context={{ refreshTrigger, setRefreshTrigger: handleRefresh }}
        />
      </main>
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={category}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PurchaseHistoryPage;
