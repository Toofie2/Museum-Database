import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !message) {
      setError(true);
      setIsSubmitted(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(false);
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/support_email`, {
        name,
        email,
        message
      });

      if (response.data.success) {
        setIsSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(true);
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="pt-24 bg-cover bg-center" style={{ backgroundImage: `url('https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3uvFHmxSJVhSU_DrKgZzxg%2Fnormalized.jpg&width=910')` }}>
        <section className="hero text-white py-16 text-center">
          <h1 className="text-4xl font-extrabold">Support</h1>
          <p className="mt-4 text-xl">We're here to help! Reach out to us for any inquiries or feedback.</p>
        </section>

        <section className="support-content px-6 py-16 max-w-7xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-lg">
          <div className="support-section mb-12">
            <h2 className="text-3xl font-semibold text-blue-800">Contact Us</h2>
            <p className="mt-4 text-lg text-gray-700">If you have any questions or need assistance, feel free to email us at <a href="mailto:houstonmuseumoffinearts@gmail.com" className="text-blue-500">houstonmuseumoffinearts@gmail.com</a>.</p>
          </div>

          <div className="support-section mb-12">
            <h2 className="text-3xl font-semibold text-blue-800">Feedback</h2>
            <p className="mt-4 text-lg text-gray-700">We value your feedback! Please leave a message below, and we'll get back to you as soon as possible.</p>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block text-lg font-medium text-gray-700">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your message here"
                  disabled={isLoading}
                ></textarea>
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Submit Feedback'}
                </button>
              </div>
            </form>

            {isSubmitted && !error && (
              <div className="mt-4 text-green-600 font-semibold">
                Your message has been sent successfully. Thank you for your feedback!
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-600 font-semibold">
                Please fill in all fields before submitting your feedback.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;