import { Link } from "react-router-dom";
import { TheFAMLogo } from "../constants/components.jsx";
import { useState, useEffect } from "react";
import { useAuth } from "../components/authentication";

const NavBarBlack = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const leftnavigation = [
    {
      name: "Tickets",
      link: "/tickets",
    },
    {
      name: "Membership",
      link: "/membership",
    },
    {
      name: "Exhibitions",
      link: "/exhibitions",
    },
    {
      name: "Collections",
      link: "/collections",
    },
    {
      name: "Shop",
      link: "/shop",
    },
    {
      name: "Review",
      link: "/review",
    },
  ];

  return (
    <nav
      className={`fixed z-10 w-full transition-all duration-300 ${
        isScrolled ? "bg-white [&_svg]:text-black shadow-md" : "text-black"
      }`}
    >
      <div className="flex justify-between items-center max-w-full mx-auto px-16 py-4">
        <div className="w-1/2">
          <ul className="flex justify-start gap-8">
            {leftnavigation.map((item) => (
              <li key={item.name}>
                <Link className="text-light-grey cursor-pointer" to={item.link}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <Link to="/">
            <TheFAMLogo />
          </Link>
        </div>
        <div className="flex justify-end w-1/2">
          <ul className="flex justify-start gap-8">
            {isAuthenticated ? (
              <li>
                <button
                  onClick={logout}
                  className="text-light-grey cursor-pointer"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="text-light-grey cursor-pointer">
                  Login
                </Link>
              </li>
            )}
            <li>
              <Link to="/cart" className="text-light-grey cursor-pointer">
                Cart (0)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBarBlack;
