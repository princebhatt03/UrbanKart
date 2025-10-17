import React from 'react';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

const ContactUs = () => {
  return (
    <>
      <UserHeader />
      <div className="bg-[#F9FAFB] py-10">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#141414]">Contact Us</h1>
        </div>

        {/* Google Map */}
        <div className="relative mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29266.72813746031!2d77.79450301700082!3d23.520234045472424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c04502a3166f5%3A0x7da6896331548213!2sVidisha%2C%20Madhya%20Pradesh%20464001!5e0!3m2!1sen!2sin!4v1721642321165!5m2!1sen!2sin"
            width="100%"
            height="350"
            className="border-0 w-full"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>

          <div className="absolute top-10 left-10 bg-white shadow-md p-6 rounded-md max-w-sm">
            <h3 className="text-xl font-semibold mb-2 text-[#141414]">
              Our store
            </h3>
            <p className="text-sm text-[#141414]">
              123 Fake St. <br /> Vidisha, Madhya Pradesh
            </p>
            <p className="text-sm text-[#141414] mt-2">
              Mon - Fri, 10am - 9pm
              <br />
              Saturday, 11am - 9pm
              <br />
              Sunday, 11am - 5pm
            </p>
            <a
              href="https://www.google.com/maps?q=Vidisha,+Madhya+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-[#FF708E] text-white rounded hover:bg-[#e75f7b] text-sm">
              Get directions
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Form Column */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-[#141414] mb-2">
              Drop Us A Line
            </h2>
            <p className="mb-6 text-[#141414]">
              Lorem Ipsum é um texto modelo da indústria tipográfica e de
              impressão.
            </p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <textarea
                rows="6"
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded"
                required></textarea>
              <button className="px-6 py-3 bg-[#FF708E] text-white rounded hover:bg-[#e75f7b]">
                Send Message
              </button>
            </form>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#141414] mb-1">Opening Hours</h3>
              <p className="text-[#141414] text-sm">
                Mon - Sat : 9am - 11pm
                <br />
                Sunday: 11am - 5pm
              </p>
            </div>
            <hr />
            <ul className="space-y-4 text-[#141414] text-sm">
              <li className="flex items-start">
                <span className="material-icons mr-2">location_on</span>
                Talliaya Moholla Vidisha
              </li>
              <li className="flex items-start">
                <span className="material-icons mr-2">phone</span>
                +9192000000
              </li>
              <li className="flex items-start">
                <span className="material-icons mr-2">email</span>
                princebhatt316@gmail.com
              </li>
            </ul>
            <hr />
            <div className="flex gap-3">
              {[
                'facebook',
                'twitter',
                'pinterest',
                'instagram',
                'tumblr',
                'youtube',
                'vimeo',
              ].map(platform => (
                <a
                  key={platform}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#141414] hover:text-[#FF708E]">
                  <i className={`icon icon-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
