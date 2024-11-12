import { Outlet } from "react-router-dom";
import EmployeeNavbar from "../../components/EmployeeNavbar.jsx";

const EmployeeLayout = () => {
  return (
    <div className="flex">
      <EmployeeNavbar />
      <main className="flex-1 p-8 bg-gray-lightest">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
