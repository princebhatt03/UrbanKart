import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import img1 from '../assets/images/SliderComponent/Slider1.jpg';
import { useNavigate } from 'react-router-dom';
import img2 from '../assets/images/SliderComponent/Slider2.jpg';
import img3 from '../assets/images/SliderComponent/Slider4.jpg';

const slides = [
  {
    img: img1,
    title: 'Sun Glases and more',
    subtitle: 'From high to low, classic or modern. We have you covered',
    btnText: 'Shop Now',
  },
  {
    img: img2,
    title: 'Summer Bikini Collection',
    subtitle: 'Save up to 50% off this weekend only',
    btnText: 'Shop Now',
  },
  {
    img: img3,
    title: 'Shop our new Collection',
    subtitle: 'Save up to 30% on any products',
    btnText: 'Shop Now',
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen relative">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full">
        {slides.map((slide, idx) => (
          <SwiperSlide
            key={idx}
            className="h-full">
            <div className="relative w-full h-full group">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center text-center px-4">
                <div className="text-white space-y-4 max-w-2xl">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold animate-fade-in-down">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg animate-fade-in-up">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="mt-4 px-6 py-3 bg-[#FF708E] text-white font-medium rounded hover:opacity-70 cursor-pointer transition animate-fade-in-up">
                    {slide.btnText}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
