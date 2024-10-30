<<<<<<< HEAD
import { useState, useEffect } from "react";
import axios from "axios";
=======
>>>>>>> f50d9922785bd7cf047be6f3968269a6cac0161d
import Navbar from "../components/Navbar.jsx";
import backgroundImage from "../assets/HomePageBackground.jpg";

const HomePage = () => {
<<<<<<< HEAD
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/exhibition");
        console.log(response);
        setExhibitions(response.data);
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
      <Navbar />
      <div className="relative h-screen pt-[4.5rem] text-white">
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
                key={exhibition.id}
                className="w-[30rem] flex flex-col space-y-0.5"
              >
                <img
                  src={exhibition.image_path}
                  alt={exhibition.name}
                  className="w-full h-[18rem] object-cover"
                />
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
              src={"../src/assets/Floor 1.png"}
              alt={"Floor 1"}
              className="h-full object-cover"
            />
            <p className="flex text-lg font-medium justify-center">Floor 1</p>
          </div>
          <div className="w-1/2 flex flex-col">
            <img
              src={"../src/assets/Floor 2.png"}
              alt={"Floor 2"}
              className="h-full object-cover"
            />
            <p className="flex text-lg font-medium justify-center">Floor 2</p>
          </div>
        </div>
      </div>
    </>
  );
=======
    return (
        <div className="relative min-h-screen">
            <Navbar />
            <div className="absolute inset-0 bg-black/50" />
            <div className="min-h-screen bg-[url('../assets/HomePageBackground.jpg')] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <p className="text-white text-4xl">The Fine Arts Museum</p>
            </div>
        </div>
    );
>>>>>>> f50d9922785bd7cf047be6f3968269a6cac0161d
};

export default HomePage;