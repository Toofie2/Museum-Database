import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const CategoryNavbar = ({ section }) => {
  const categorynavigation = [
    {
      name: "Exhibition",
      link: "/exhibition",
    },
    {
      name: "Collection",
      link: "/collection",
    },
    {
      name: "Product",
      link: "/product",
    },
    {
      name: "Ticket",
      link: "/ticket",
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
            to={`/employee/${section}${item.link}`}
            end
          >
            <p>{item.name}</p>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

CategoryNavbar.propTypes = {
  section: PropTypes.oneOf(["settings"]).isRequired,
};

export default CategoryNavbar;
