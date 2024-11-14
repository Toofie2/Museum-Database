import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/HomePageBackground.jpg";
import floor1Image from "../assets/Floor 1.png";
import floor2Image from "../assets/Floor 2.png";

const HomePage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [upcomingExhibition, setUpcomingExhibition] = useState(null);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/exhibition`
        );
        const fetchedExhibitions = response.data;
        setExhibitions(fetchedExhibitions);
        const upcoming = fetchedExhibitions.find(
          (exhibition) => exhibition.banner === 1
        );
        if (upcoming) {
          setUpcomingExhibition(upcoming);
          setShowBanner(true);
        }
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      }
    };
    fetchExhibitions();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      {showBanner && upcomingExhibition && (
        <div className="bg-red-600 text-white p-6 flex justify-between items-center fixed w-full top-0 z-50">
          <span className="text-xl ml-14 relative">
            <span className="absolute left-0 -translate-x-full text-2xl">★</span>
            Check out our new exhibition{" "}
            {upcomingExhibition.name} starting on{" "}
            {formatDate(upcomingExhibition.start_date)} under our exhibitions tab!
            <span className="absolute right-0 translate-x-full text-2xl">★</span>
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="text-black font-medium px-3"
          >
            X
          </button>
        </div>
      )}
      <Navbar />
      <div className={`relative h-screen pt-[4.5rem] text-white ${showBanner ? 'mt-[4.5rem]' : ''}`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="h-[calc(100vh-4.5rem)] relative flex flex-col items-start mx-16 space-y-5 justify-center ">
          <p className="text-lg">WELCOME TO</p>
          <p className="flex flex-col text-7xl font-cavas">
            <span>THE</span>
            <span>FINE</span>
            <span>ARTS</span>
            <span>MUSEUM</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col my-5 space-y-5">
        <div className="mx-16 flex">
          <p className="flex w-2/3 text-2xl font-medium items-center">
            Exhibitions on Display
          </p>
          <p className="text-right">
            Explore our diverse exhibitions, from stunning paintings to
            captivating illustrations, thought-provoking installations to
            beautiful sculptures.
          </p>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="flex gap-5 min-w-max mx-16">
            {exhibitions.map((exhibition) => (
              <div
                key={exhibition.exhibit_id}
                className="w-[30rem] flex flex-col space-y-0.5"
              >
                <Link to={`/exhibition/${exhibition.exhibit_id}`}>
                  <img
                    src={exhibition.image_path}
                    alt={exhibition.name}
                    className="w-full h-[18rem] object-cover cursor-pointer"
                  />
                </Link>
                <h2 className="text-lg font-medium">{exhibition.name}</h2>
                <p>Through {formatDate(exhibition.end_date)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col my-5 space-y-5">
        <div className="mx-16 flex">
          <p className="flex w-2/3 text-2xl font-medium items-center">
            Museum Map
          </p>
          <p className="text-right">
            Easily locate our galleries, exhibits, facilities, and amenities to
            plan your visit and make the most of your time here.
          </p>
        </div>
        <div className="flex mx-16 gap-5">
          <div className="w-1/2 flex flex-col">
            <img
              src={floor1Image}
              alt={"Floor 1"}
              className="h-full object-cover"
            />
            <p className="flex text-lg font-medium justify-center">Floor 1</p>
          </div>
          <div className="w-1/2 flex flex-col">
            <img
              src={floor2Image}
              alt={"Floor 2"}
              className="h-full object-cover"
            />
            <p className="flex text-lg font-medium justify-center">Floor 2</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
