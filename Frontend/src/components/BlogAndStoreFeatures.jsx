import React from 'react';
import {
  FaTruck,
  FaDollarSign,
  FaComments,
  FaCreditCard,
} from 'react-icons/fa';
import img1 from '../assets/images/blog/post-img1.jpg';
import img2 from '../assets/images/blog/post-img2.jpg';

const blogs = [
  {
    title: "It's all about how you wear",
    date: 'May 02, 2017',
    excerpt:
      'I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account...',
    image: img1,
  },
  {
    title: '27 Days of Spring Fashion Recap',
    date: 'May 02, 2017',
    excerpt:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab...',
    image: img2,
  },
];

const features = [
  {
    icon: (
      <FaTruck
        size={36}
        className="text-[#FF708E]"
      />
    ),
    title: 'Free Shipping & Return',
    subtitle: 'Free shipping on all US orders',
  },
  {
    icon: (
      <FaDollarSign
        size={36}
        className="text-[#FF708E]"
      />
    ),
    title: 'Money Guarantee',
    subtitle: '30 days money back guarantee',
  },
  {
    icon: (
      <FaComments
        size={36}
        className="text-[#FF708E]"
      />
    ),
    title: 'Online Support',
    subtitle: 'We support online 24/7 on day',
  },
  {
    icon: (
      <FaCreditCard
        size={36}
        className="text-[#FF708E]"
      />
    ),
    title: 'Secure Payments',
    subtitle: 'All payment are Secured and trusted.',
  },
];

const BlogAndStoreFeatures = () => {
  return (
    <div>
      {/* Latest Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase tracking-wider">
              Latest From Our Blog
            </h2>
          </div>
          <div className="space-y-10">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="w-full md:w-3/16 h-64 md:h-56">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 p-6">
                  <h3 className="text-lg font-semibold uppercase tracking-wide mb-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{blog.date}</p>
                  <p className="text-gray-700 text-sm mb-4">{blog.excerpt}</p>
                  <p className="text-[#FF708E] cursor-pointer font-medium text-sm hover:underline">
                    Read More
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Feature Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center space-y-3">
                {feature.icon}
                <h5 className="text-lg font-semibold">{feature.title}</h5>
                <p className="text-sm text-gray-600">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogAndStoreFeatures;
