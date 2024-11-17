import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Parking = () => {
  return (
    <div>
      <Navbar />

      <main className="pt-24 bg-cover bg-center" style={{ backgroundImage: `url('https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3uvFHmxSJVhSU_DrKgZzxg%2Fnormalized.jpg&width=910')` }}>
        <section className="hero text-white py-16 text-center">
          <h1 className="text-4xl font-extrabold">Parking at Our Museum</h1>
          <p className="mt-4 text-xl">Convenient parking options for a stress-free visit to the Houston Fine Arts Museum.</p>
        </section>

        <section className="parking-info px-6 py-16 max-w-7xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-blue-800 mb-6">Parking Information</h2>
          <p className="text-lg text-gray-700 mb-6">
            We offer convenient and accessible parking for all visitors to the Houston Fine Arts Museum. Whether you are visiting for a short time or plan to stay for a few hours, you’ll find parking options that suit your needs.
          </p>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Museum Parking Garage</h3>
          <p className="text-lg text-gray-700 mb-6">
            Our primary parking garage is located directly across from the museum entrance. The garage is open every day during museum hours and offers easy access to the museum.
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>Open Monday to Sunday: 8:00 AM - 10:00 PM</li>
            <li>Rate: $5 per hour, with a maximum daily charge of $20</li>
            <li>Payment methods accepted: Cash, credit/debit cards, and mobile payment apps</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Additional Parking Options</h3>
          <p className="text-lg text-gray-700 mb-6">
            If the museum garage is full, there are additional parking options within walking distance:
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>City Parking Lot A (2 blocks away): $3 per hour</li>
            <li>Public Parking Garage B (3 blocks away): $4 per hour</li>
            <li>Street parking: Free after 6:00 PM (limited spaces available)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Accessible Parking</h3>
          <p className="text-lg text-gray-700 mb-6">
            Accessible parking spaces are available in our museum parking garage and are marked clearly with the international symbol of access. These spaces are provided on a first-come, first-served basis.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Additional accessible parking is available at nearby City Parking Lot A and Public Parking Garage B, with spaces located close to the entrance.
          </p>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Electric Vehicle Charging</h3>
          <p className="text-lg text-gray-700 mb-6">
            We offer electric vehicle charging stations in the museum parking garage for your convenience. There are two charging stations located near the entrance of the garage. These stations support both Tesla and non-Tesla electric vehicles.
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>Charging rate: $1.00 per hour</li>
            <li>Charging stations are available on a first-come, first-served basis</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Parking for Groups & Events</h3>
          <p className="text-lg text-gray-700 mb-6">
            If you're visiting as part of a group or attending a special event, please contact our Guest Services at least 24 hours in advance to reserve group parking. We can also provide valet parking services for large events upon request.
          </p>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Lost or Stolen Items</h3>
          <p className="text-lg text-gray-700 mb-6">
            If you have lost an item in the parking garage, please visit our Guest Services desk or call us at (555) 123-4567. We are happy to assist you in locating any lost property.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Parking;
