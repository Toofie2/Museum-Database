import { Outlet } from "react-router-dom";

const PurchaseHistoryLayout = () => {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto p-8 bg-gray-lightest">
        <Outlet />
      </main>
    </div>
  );
};

export default PurchaseHistoryLayout;
