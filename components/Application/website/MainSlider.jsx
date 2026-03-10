"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import slider1 from "@/public/assets/images/slider-1.png";
import slider2 from "@/public/assets/images/slider-2.png";
import slider3 from "@/public/assets/images/slider-3.png";
import slider4 from "@/public/assets/images/slider-4.png";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const ArrowNext = (props) => {
  const { onClick } = props
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      type="button"
      className="w-5 h-5 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 right-10 shadow-lg"
    >
      <FaChevronRight size={25} className="text-gray-600" />
    </motion.button>
  );
};

const ArrowPrev = (props) => {
  const { onClick } = props
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      type="button"
      className="w-5 h-5 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 left-10 shadow-lg"
    >
      <FaChevronLeft size={25} className="text-gray-600" />
    </motion.button>
  );
};

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrev />,

    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrow: false,
          nextArrow: '',
          prevArrow: '',
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Slider {...settings}>
        <div className="relative">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src={slider1.src}
              width={slider1.width}
              height={slider1.height}
              alt="slider 1"
              priority
            />
          </motion.div>
        </div>
        <div>
          <Image
            src={slider2.src}
            width={slider2.width}
            height={slider2.height}
            alt="slider 2"
          />
        </div>
        <div>
          <Image
            src={slider3.src}
            width={slider3.width}
            height={slider3.height}
            alt="slider 3"
          />
        </div>
        <div>
          <Image
            src={slider4.src}
            width={slider4.width}
            height={slider4.height}
            alt="slider 4"
          />
        </div>
      </Slider>
    </motion.div>
  );
};

export default MainSlider;
