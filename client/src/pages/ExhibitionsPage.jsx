import Navbar from "../components/Navbar";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ExhibitionsPage = () => {
  const [Exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/exhibition');
        setExhibitions(response.data);
      } catch (error) {
        console.error('Error fetching exhibitions:', error);
      }
    };
    fetchExhibitions();
  }, []);

  return (
    <div className="container mx-auto p-0">
      <Navbar />
      {/* Banner Section */}
      <div className="relative flex items-center h-[800px]">
        <img
          src="https://images.unsplash.com/photo-1568392388350-a33157b67a8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Exhibition Banner"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-4 space-y-2">
          <h1 className="text-8xl font-regular text-white z-10 w-[600px] p-6">Exhibitions</h1>
          <p className="text-3xl font-thin text-white z-10 w-[800px] p-6">
            Explore our diverse exhibitions, from stunning paintings to captivating illustrations, thought-provoking installations to beautiful sculptures.
          </p>
        </div>
      </div>

      {/* Exhibitions List */}
      <div className="container mx-auto p-7 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {Exhibitions.map((Exhibition) => (
            <div key={Exhibition.exhibit_id} className="exhibition-item relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
              <Link to={`/exhibition/${Exhibition.exhibit_id}`}>
                <img
                  src={Exhibition.image_path}
                  alt={Exhibition.name}
                  className="w-full h-64 object-cover  transition-transform duration-300 transform hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 ease-in-out hover:bg-opacity-40 flex items-end">
                  <h2 className="text-2xl font-thin text-white ml-4 mb-4">{Exhibition.name}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionsPage;
