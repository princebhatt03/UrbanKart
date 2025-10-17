import React from 'react';
import kidsBanner from '../assets/images/collection/home5-banner2.jpg';

const KidsParallaxSection = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] bg-[#F9FAFB] overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${kidsBanner})` }}></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center px-6 lg:px-20">
        <div className="text-center max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Costmatic Products
          </h2>
          <p className="text-white text-lg mb-6">
            You wouldn't believe how amazing this maplly lipstick are!
          </p>
          <p className="inline-block bg-[#FF708E] cursor-pointer hover:opacity-70 text-white px-6 py-3 rounded-md text-sm font-medium transition">
            Get Your Set Today
          </p>
        </div>
      </div>
    </section>
  );
};

export default KidsParallaxSection;
