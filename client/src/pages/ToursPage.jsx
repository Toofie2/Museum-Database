import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Tours = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setError(false);
  };

  return (
    <div>
      <Navbar />

      <main className="pt-24 bg-cover bg-center" style={{ backgroundImage: `url('https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3uvFHmxSJVhSU_DrKgZzxg%2Fnormalized.jpg&width=910')` }}>
        <section className="hero text-white py-16 text-center">
          <h1 className="text-4xl font-extrabold">Upcoming Museum Tours</h1>
          <p className="mt-4 text-xl">Join us for a guided tour through our exhibitions and explore art, history, and culture!</p>
        </section>

        <section className="tour-dates px-6 py-16 max-w-7xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-lg">
          <div className="tour-section mb-12">
            <h2 className="text-3xl font-semibold text-blue-800">Upcoming Tour Dates</h2>

            <div className="tour-list mt-6">
              <div className="tour-item mb-8">
                <h3 className="text-2xl font-semibold text-blue-700">November 30, 2024 - Cultural Heritage Tour</h3>
                <p className="mt-2 text-lg text-gray-700">Join us for an immersive tour through the cultural heritage of our region, with special focus on indigenous art and artifacts.</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">Location: Main Hall, Houston Fine Arts Museum</p>
                <p className="mt-2 text-sm text-gray-600">Time: 10:00 AM - 12:00 PM</p>
              </div>
              <div className="tour-item mb-8">
                <h3 className="text-2xl font-semibold text-blue-700">December 12, 2024 - Modern Art Tour</h3>
                <p className="mt-2 text-lg text-gray-700">Explore the latest trends in modern art with our expert guides. This tour will delve into contemporary movements and iconic works of the 21st century.</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">Location: Modern Art Gallery, Houston Fine Arts Museum</p>
                <p className="mt-2 text-sm text-gray-600">Time: 1:00 PM - 3:00 PM</p>
              </div>
              <div className="tour-item mb-8">
                <h3 className="text-2xl font-semibold text-blue-700">January 5, 2025 - Art in Nature Tour</h3>
                <p className="mt-2 text-lg text-gray-700">This tour focuses on the relationship between art and the natural world. Featuring landscape paintings, sculptures, and nature-inspired installations.</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">Location: Outdoor Sculpture Garden, Houston Fine Arts Museum</p>
                <p className="mt-2 text-sm text-gray-600">Time: 11:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
          <div className="contact-section mb-12">
            <h2 className="text-3xl font-semibold text-blue-800">Contact Us or RSVP</h2>
            <p className="mt-4 text-lg text-gray-700">Have questions or want to reserve a spot? Contact us below!</p>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tour" className="block text-lg font-medium text-gray-700">Select Tour</label>
                <select
                  id="tour"
                  name="tour"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tour1">Cultural Heritage Tour - November 30, 2024</option>
                  <option value="tour2">Modern Art Tour - December 12, 2024</option>
                  <option value="tour3">Art in Nature Tour - January 5, 2025</option>
                </select>
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  RSVP or Ask a Question
                </button>
              </div>
            </form>
            {isSubmitted && !error && (
              <div className="mt-4 text-green-600 font-semibold">
                Your message has been sent successfully. We'll get back to you shortly!
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-600 font-semibold">
                Please fill in all fields before submitting your inquiry.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tours;
