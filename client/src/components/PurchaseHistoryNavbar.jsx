import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const PurchaseHistoryNavbar = ({ section }) => {
  const categorynavigation = [
    {
      name: "Ticket",
      link: "/ticket",
    },
    {
      name: "Exhibition",
      link: "/exhibition",
    },
    {
      name: "Product",
      link: "/product",
    },
  ];
  return (
    <nav className="text-black">
      <div className="flex items-start my-8 space-x-5">
        {categorynavigation.map((item) => (
          <NavLink
            key={item.link}
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition-colors ${
                isActive ? "bg-gray-light text-black" : "text-gray-dark"
              }`
            }
            to={`/${section}${item.link}`}
            end
          >
            <p>{item.name}</p>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

PurchaseHistoryNavbar.propTypes = {
  section: PropTypes.oneOf(["purchasehistory"]).isRequired,
};

export default PurchaseHistoryNavbar;
