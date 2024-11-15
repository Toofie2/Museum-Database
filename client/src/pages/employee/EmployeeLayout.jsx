import { Outlet } from "react-router-dom";
import EmployeeNavbar from "../../components/EmployeeNavbar.jsx";

const EmployeeLayout = () => {
  return (
    <div className="flex h-screen">
      <aside className="fixed top-0 left-0 h-full">
        <EmployeeNavbar />
      </aside>
      <main className="flex-1 overflow-auto ml-[20rem] p-8 bg-gray-lightest">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
