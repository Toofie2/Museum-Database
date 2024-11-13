import { TheFAMLogo } from "../constants/components";
import { NavLink } from "react-router-dom";

const EmployeeNavbar = () => {
  const navigation = [
    {
      name: "Dashboard",
      link: "/dashboard",
      symbol: "dashboard",
    },
    // {
    //   name: "Inventory",
    //   link: "/inventory",
    //   symbol: "inventory_2",
    // },
    {
      name: "Settings",
      link: "/settings",
      symbol: "settings",
    },
    {
      name: "Reports",
      link: "/reports",
      symbol: "lab_profile",
    },
  ];
  return (
    <nav className="h-screen w-[20rem] bg-white text-black">
      <div className="mx-10">
        <div className="flex items-center justify-center h-20 gap-4 border-b border-gray-medium">
          <TheFAMLogo />
          <p>Employee Portal</p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col space-y-8 items-start mx-5 my-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded transition-colors ${
                    isActive ? "bg-gray-light text-black" : "text-gray-dark"
                  }`
                }
                to={`/employee${item.link}`}
                end={item.link === ""}
              >
                <span className="material-symbols-outlined">{item.symbol}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
