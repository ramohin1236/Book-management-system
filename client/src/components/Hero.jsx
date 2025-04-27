import React, { useState, useEffect } from 'react';
import { useBooks } from '../context/BookContext';
import { FaSearch } from 'react-icons/fa';
import image2 from '../../public/book 2.jpg'
import image3 from '../../public/book 3.jpg'
import image4 from '../../public/book 4.jpg'

const slides = [
  image4,
  'https://res.cloudinary.com/dgzxzepc8/image/upload/v1745639235/kc7ixymg09bmxm2xlyfi.jpg',
  image2,
  image3
];

const Hero = () => {
  const { updateFilters } = useBooks();
  const [searchInput, setSearchInput] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim(), page: 1 });
  };

  const handleClear = () => {
    setSearchInput('');
    updateFilters({ search: '', page: 1 });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col container mx-auto md:flex-row w-full h-[90vh] overflow-hidden">
      {/* Left Side - Text and Search */}
      <div className="flex flex-col justify-center items-center md:items-start w-full md:w-[50%] px-6 md:px-12 text-center md:text-left space-y-6 z-10 ">
      
      <div className="p-6 max-w-md ">
      <h1 className="text-5xl font-bold leading-tight font-custom">
        We want
        <div className="bg-orange-200 flex flex-col gap-5
         mt-2 p-2">
          <h1 className='text-7xl font-custom'> more poets <br /> like you</h1>
          
          <div className="w-16 h-0.5 bg-black mt-4 mb-2"></div>
          <p className="text-xl text-gray-700">21 March, World Poetry Day</p>
        </div>
      </h1>
    </div>

        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by book title"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-6 py-4 pl-12 rounded-full bg-gray-900 bg-opacity-70 text-white border border-gray-700 focus:outline-none focus:border-amber-500 pr-32"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 px-2"
              >
                ×
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-500 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-amber-400 transition-colors"
            >
              SEARCH
            </button>
          </div>
        </form>

        <div>
           <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam cupiditate earum incidunt hic assumenda similique, dolore error ea maiores vel, suscipit excepturi, officiis consectetur iusto dolorem.</p>
        </div>
      </div>

      <div className="relative md:w-[60%] h-[70%]
      pt-20">
  {/* Slides */}
  {slides.map((image, index) => (
    <img
      key={index}
      src={image}
      alt={`Slide ${index + 1}`}
      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
        index === currentSlide ? 'opacity-100 z-0' : 'opacity-0'
      }`}
    />
  ))}

  {/* Dots */}
  <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
    {slides.map((_, index) => (
      <div
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
          index === currentSlide ? 'bg-[#1E3A8A]' : 'bg-[#1E3A8A]/50'
        }`}
      ></div>
    ))}
  </div>
</div>


    </div>
  );
};

export default Hero;
