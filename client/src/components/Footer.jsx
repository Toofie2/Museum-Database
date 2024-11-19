import React from 'react';
import { Link } from 'react-router-dom';
import { TheFAMLogo } from "../constants/components.jsx";
import { Facebook, Instagram, Twitter, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: "About Us", link: "/about" },
    { name: "Exhibitions", link: "/exhibitions" },
    { name: "Collections", link: "/collections" },
    { name: "Membership", link: "/membership" },
    { name: "Support", link: "/support" }
  ];

  const shopLinks = [
    { name: "Art Prints", link: "/shop/1" },
    { name: "Unframed Prints & Posters", link: "/shop/2" },
    { name: "Books & Media", link: "/shop/6" },
    { name: "Jewelry", link: "/shop/7" },
    { name: "Home Decor", link: "/shop/8" },
    { name: "Games and Puzzles", link: "/shop/3" },
    { name: "Art Supplies", link: "/shop/4" }
  ];

  const visitLinks = [
    { name: "Plan Your Visit", link: "/tickets" },
    { name: "Tours", link: "/tours" },
    { name: "Accessibility", link: "/accessibility" },
    { name: "Parking", link: "/parking" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-full mx-auto px-16">
        <div className="grid grid-cols-5 gap-8 pb-12 border-b border-gray-700">
          {/* Column 1: Logo and Social */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="block w-48">
              <TheFAMLogo />
            </Link>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-gray-300 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-gray-300 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Visit */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Visit</h3>
            <ul className="space-y-3">
              {visitLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-gray-300 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact & Hours */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <p>1001 Museum District Boulevard<br />Houston, TX 77005</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <a href="mailto:houstonmuseumoffinearts@gmail.com" className="hover:text-white">
                    houstonmuseumoffinearts@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <p>Open Daily<br />8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 text-center text-gray-400">
          <p className="text-sm">
            © {new Date().getFullYear()} FAM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;