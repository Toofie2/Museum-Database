import { Outlet } from "react-router-dom";
import CategoryNavbar from "../../components/CategoryNavbar";

const Settings = () => {
  return (
    <div>
      <p className="text-2xl">Settings</p>
      <CategoryNavbar section="settings" />
      <main className="flex-1 p-8 bg-gray-lightest">
        <Outlet />
      </main>
    </div>
  );
};

export default Settings;
