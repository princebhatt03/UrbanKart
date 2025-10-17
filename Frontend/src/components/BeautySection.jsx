import React from 'react';
import cosmetic1 from '../assets/images/collection/cosmetic1.jpg';
import cosmetic2 from '../assets/images/collection/cosmetic2.jpg';
import cosmetic3 from '../assets/images/collection/cosmetic3.jpg';
import { useNavigate } from 'react-router-dom';

const beautyPicks = [
  {
    title: 'Color Cosmetics',
    description:
      'There is nothing more you can ask for. Gives your skin a natural glow with matte finish',
    image: cosmetic1,
    button: 'Shop Now',
  },
  {
    title: 'Lip Color',
    description:
      'Enjoy the stay. Love the Shine. Long-lasting ultramatte perfect lip color',
    image: cosmetic2,
    button: 'Shop New Arrivals',
  },
  {
    title: 'Eyeliner',
    description:
      'Wing it with perfection. Dramatic wing perfection. Fine tip liquid eyeliner stay long lasting',
    image: cosmetic3,
    button: 'Buy Now',
  },
];

const FeaturedBeautyPicks = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/shop');
  };
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Best Beauty Picks For You!
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          {beautyPicks.map((item, index) => (
            <div
              key={index}
              className="space-y-4">
              <p>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </p>
              <h3 className="text-xl font-semibold text-gray-800">
                <p className="hover:text-[#FF708E]">{item.title}</p>
              </h3>
              <p className="text-sm text-gray-600 px-2">{item.description}</p>
              <p
                className="inline-block cursor-pointer text-[#FF708E] font-medium border border-[#FF708E] px-5 py-2 rounded-md hover:bg-[#FF708E] hover:text-white transition"
                onClick={handleClick}>
                {item.button}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBeautyPicks;
