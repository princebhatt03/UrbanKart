import React from 'react';
import fashion from '../assets/images/collection/fashion.jpg';
import cosmetic from '../assets/images/collection/cosmetic.jpg';
import bag from '../assets/images/collection/bag.jpg';
import accessories from '../assets/images/collection/accessories.jpg';
import shoes from '../assets/images/collection/shoes.jpg';
import jewellry from '../assets/images/collection/jewellry.jpg';

const collections = [
  { name: 'Fashion', img: fashion },
  { name: 'Cosmetic', img: cosmetic },
  { name: 'Bag', img: bag },
  { name: 'Accessories', img: accessories },
  { name: 'Shoes', img: shoes },
  { name: 'Jewellry', img: jewellry },
];

const CollectionGrid = () => {
  return (
    <section className="py-12 bg-[#F9FAFB]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collections.map((item, index) => (
            <div
              key={index}
              className="group block relative overflow-hidden rounded-xl shadow hover:shadow-lg transition">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-lg sm:text-xl font-semibold bg-black/50 px-4 py-2 rounded-lg group-hover:scale-105 transition duration-300">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;
