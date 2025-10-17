import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaInstagram,
  FaTumblr,
  FaYoutube,
  FaVimeoV,
  FaCcVisa,
  FaCcMastercard,
  FaCcDiscover,
  FaCcPaypal,
  FaCcAmex,
  FaCreditCard,
} from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#141414] text-white">
      {/* Newsletter Section */}
      <div className="py-10 px-4 bg-white border-b animate-fade-in-up">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">
              Sign up for <span className="text-[#FF708E]">newsletter</span>
            </h2>
            <form className="flex flex-col sm:flex-row max-w-xl mx-auto lg:mx-0">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 p-3 border text-black border-gray-300 rounded-t-md sm:rounded-l-md sm:rounded-tr-none focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-[#FF708E] text-white px-6 py-3 rounded-b-md sm:rounded-r-md sm:rounded-bl-none hover:opacity-70 transition duration-300">
                Subscribe
              </button>
            </form>
          </div>
          <div className="flex justify-center lg:justify-end space-x-4 text-xl text-gray-600">
            {[
              FaFacebookF,
              FaTwitter,
              FaPinterest,
              FaInstagram,
              FaTumblr,
              FaYoutube,
              FaVimeoV,
            ].map((Icon, index) => (
              <p
                key={index}
                className="hover:text-[#FF708E] cursor-pointer transition-transform transform hover:scale-110">
                <Icon />
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in">
        {/* Footer Sections */}
        {[
          {
            title: 'Quick Shop',
            links: [
              { name: 'Women', path: '/category/women' },
              { name: 'Men', path: '/category/men' },
              { name: 'Kids', path: '/category/kids' },
              { name: 'Sportswear', path: '/category/sportswear' },
              { name: 'Sale', path: '/sale' },
            ],
          },
          {
            title: 'Informations',
            links: [
              { name: 'Home', path: '/' },
              { name: 'About us', path: '/about' },
              { name: 'Careers', path: '/careers' },
              { name: 'Privacy policy', path: '/privacy-policy' },
              { name: 'Terms & condition', path: '/terms-conditions' },
              { name: 'Contact', path: '/contact' },
            ],
          },
          {
            title: 'Customer Services',
            links: [
              { name: 'Request Personal Data', path: '/request-data' },
              { name: "FAQ's", path: '/faqs' },
              { name: 'Contact Us', path: '/contact' },
              { name: 'Orders and Returns', path: '/orders-returns' },
              { name: 'Support Center', path: '/support' },
            ],
          },
        ].map((section, i) => (
          <div key={i}>
            <h4 className="text-lg font-semibold mb-4 text-[#FF708E]">
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link, idx) => (
                <li key={idx}>
                  <p
                    onClick={() => navigate(link.path)}
                    className="hover:text-[#FF708E] cursor-pointer transition duration-200">
                    {link.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-[#FF708E]">
            Contact Us
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <p className="font-medium">Address:</p>
              <p>
                55 Gallaxy Enque,
                <br />
                2568 street, 23568 NY
              </p>
            </li>
            <li>
              <p className="font-medium">Phone:</p>
              <p>123456789</p>
            </li>
            <li>
              <p className="font-medium">Email:</p>
              <p>princebhatt316@gmail.com</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t py-6 px-4 bg-[#141414] animate-fade-in-up">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-white gap-4">
          <p>
            <a
              href="https://www.linkedin.com/in/prince-bhatt-0958a725a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline">
              Designed by Prince Bhatt
            </a>
          </p>
          <div className="flex space-x-4 text-xl">
            {[
              FaCcVisa,
              FaCcMastercard,
              FaCcDiscover,
              FaCcPaypal,
              FaCcAmex,
              FaCreditCard,
            ].map((Icon, index) => (
              <Icon
                key={index}
                className="hover:text-[#FF708E] transition-transform transform hover:scale-110"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
