import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div>
      <Navbar />

      <main className="pt-24 bg-cover bg-center" style={{ backgroundImage: `url('https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3uvFHmxSJVhSU_DrKgZzxg%2Fnormalized.jpg&width=910')` }}>
        <section className="hero text-white py-16 text-center">
          <h1 className="text-4xl font-extrabold">About Our Museum</h1>
          <p className="mt-4 text-xl">Discover the rich history and cultural heritage of our museum.</p>
        </section>

        <section className="about-content px-6 py-16 max-w-7xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-lg">
          <div className="about-section mb-12">
            <h2 className="text-3xl font-semibold text-blue-800">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-700">Our museum is dedicated to preserving and sharing the stories of our community. We strive to inspire and educate visitors through our diverse collection of art, artifacts, and interactive exhibits.</p>
          </div>

          <div className="about-section mb-12">
            <h2 className="text-3xl font-semibold text-blue-800">Our History</h2>
            <p className="mt-4 text-lg text-gray-700">The museum was founded in 1985 with the goal of becoming a hub for art and culture in our city. Over the years, we've expanded our collection and facilities to better serve our community.</p>
          </div>

          <div className="about-section">
            <h2 className="text-3xl font-semibold text-blue-800">Our Team</h2>
            <p className="mt-4 text-lg text-gray-700">Our museum is led by a dedicated team of curators, educators, and support staff who are passionate about sharing our rich heritage with visitors from all over the world.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
