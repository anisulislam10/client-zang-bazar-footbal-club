import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import Slider from "../components/Slider";
import Game_next_previous from "../components/Game_next_previous";
import Trophies from "../components/Trophies";
import News from "./News";
import About from "./About";
import NextMatch from "../components/NextMatch";
import LastMatch from "../components/LastMatch";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative">
      <div className="sm:px-6 md:px-8 lg:px-1">
        <Slider />
      </div>
   <div className="flex flex-col md:flex-row gap-6 " >
        <div className="w-full md:w-1/2">
          <NextMatch />
        </div>
        
        <div className="w-full md:w-1/2">
          <LastMatch />
        </div>
      </div>
      <Trophies/>
      <About/>

      {/* Back to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default Home;