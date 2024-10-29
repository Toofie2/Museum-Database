import { Link } from "react-router-dom";
import { TheFAMLogo } from "../constants/components.jsx";

const NavBar = () => {
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
            name: "Art",
            link: "/art",
        },
        {
            name: "Shop",
            link: "/shop",
        },
        {
            name: "Review",
            link: "/review",
        }
    ];
    const rightnavigation = [
        {
            name: "Login",
            link: "/login"
        },
        {
            name: "Cart (0)",
            link: "/cart"
        }
    ];
    return (
        <nav className="fixed z-10 w-full text-white">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
                <div className="w-1/2">
                    <ul className="flex justify-start gap-8">
                        {leftnavigation.map((item) => (
                            <li key={item.name}>
                                <Link >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-center">
                    <Link>
                        <TheFAMLogo className="text-white" />
                    </Link>
                </div>
                <div className="flex justify-end w-1/2">
                    <ul className="flex justify-start gap-8">
                        {rightnavigation.map((item) => (
                            <li key={item.name}>
                                <Link >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;