import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Accessibility = () => {
  return (
    <div>
      <Navbar />

      <main className="pt-24 bg-cover bg-center" style={{ backgroundImage: `url('https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3uvFHmxSJVhSU_DrKgZzxg%2Fnormalized.jpg&width=910')` }}>
        <section className="hero text-white py-16 text-center">
          <h1 className="text-4xl font-extrabold">Accessibility at Our Museum</h1>
          <p className="mt-4 text-xl">We are committed to providing an inclusive and accessible experience for all of our visitors.</p>
        </section>

        <section className="accessibility-content px-6 py-16 max-w-7xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-blue-800 mb-6">Our Commitment to Accessibility</h2>
          <p className="text-lg text-gray-700 mb-6">
            At the Houston Fine Arts Museum, we strive to create an environment that is accessible to all visitors. Our goal is to ensure that everyone, regardless of ability, has an equal opportunity to enjoy the museum's exhibits, programs, and events.
          </p>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Website Accessibility</h3>
          <p className="text-lg text-gray-700 mb-6">
            Our website has been designed to meet accessibility standards, including the Web Content Accessibility Guidelines (WCAG) 2.1. These guidelines help us provide a more inclusive web experience for visitors with various disabilities. Key features include:
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>High-contrast color schemes for easy readability</li>
            <li>Keyboard navigability for those who cannot use a mouse</li>
            <li>Text alternatives for images and multimedia content</li>
            <li>Accessible forms and buttons for improved user interaction</li>
            <li>Clear and descriptive headings for easier navigation</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Physical Accessibility</h3>
          <p className="text-lg text-gray-700 mb-6">
            Our museum is designed to be accessible for all visitors. We offer:
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>Wheelchair ramps and elevators for easy access to all floors</li>
            <li>Wheelchair and mobility aid rentals available at the Guest Services desk</li>
            <li>Accessible restroom facilities on every floor</li>
            <li>Designated seating for individuals with mobility challenges during events</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Assistive Technologies</h3>
          <p className="text-lg text-gray-700 mb-6">
            We are proud to offer a variety of assistive technologies to enhance your visit:
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>Audio guides available in multiple languages, including for visually impaired visitors</li>
            <li>Audio description services for select exhibitions</li>
            <li>Closed captioning for videos and multimedia presentations</li>
            <li>Sign language interpreters available for tours and events upon request</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Feedback and Requests</h3>
          <p className="text-lg text-gray-700 mb-6">
            We welcome feedback on how we can improve accessibility at our museum. If you have any specific needs or requests for accommodations during your visit, please do not hesitate to contact us. We are committed to making adjustments to ensure your experience is as comfortable and enjoyable as possible.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            You can contact us at <a href="mailto:houstonfineartsmuseum@gmail.com" className="text-blue-600">houstonfineartsmuseum@gmail.com</a> or call our Guest Services at (555) 123-4567.
          </p>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Additional Resources</h3>
          <p className="text-lg text-gray-700 mb-6">
            For more information on web accessibility or to learn about other services we offer, please visit the following resources:
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-blue-600">Web Content Accessibility Guidelines (WCAG) Quick Reference</a></li>
            <li><a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600">Americans with Disabilities Act (ADA) Information</a></li>
            <li><a href="https://www.nad.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600">National Association of the Deaf (NAD)</a></li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Accessibility;
