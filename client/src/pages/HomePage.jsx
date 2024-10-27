import Navbar from "../components/Navbar.jsx";
import backgroundImage from "../assets/HomePageBackground.jpg";

const HomePage = () => {
    return (
        <div className="relative min-h-screen">
            <Navbar />
            <div className="absolute inset-0 bg-black/50" />
            <div className="min-h-screen bg-[url('../assets/HomePageBackground.jpg')] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <p className="text-white text-4xl">The Fine Arts Museum</p>
            </div>
        </div>
    );
};

export default HomePage;