import { Outlet } from "react-router-dom";
import CategoryNavbar from "../../components/CategoryNavbar";
import { useParams } from "react-router-dom";
import { useState } from "react";
import AddItemModal from "../../components/AddItemModal";

const Settings = () => {
  const { category } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl">Settings</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex bg-white text-gray-dark px-3 py-2 rounded-md transition duration-200 border-gray-medium border justify-between gap-1"
        >
          <span className="material-symbols-outlined">add</span>
          Add <span className="capitalize">{category}</span>
        </button>
      </div>
      <CategoryNavbar section="settings" />
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

export default Settings;
