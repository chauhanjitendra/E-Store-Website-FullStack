"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa6";
import { BsChatQuote } from "react-icons/bs";


const testimonials = [
  {
    name: "Aarav Sharma",
    review: `This platform completely changed my shopping experience.
The website is fast, clean, and very easy to navigate.
I found exactly what I needed without any confusion.`,
    rating: 5,
  },
  {
    name: "Priya Patel",
    review: `Customer support was extremely helpful and responsive.
They solved my issue within minutes without any hassle.
I truly appreciate the professionalism and quick service.`,
    rating: 4,
  },
  {
    name: "Rohan Mehta",
    review: `The product quality exceeded my expectations.
Everything was exactly as shown in the pictures.
Delivery was also faster than promised.`,
    rating: 5,
  },
  {
    name: "Sneha Verma",
    review: `I love the user-friendly interface of the website.
The checkout process was smooth and secure.
Definitely recommending this to my friends and family.`,
    rating: 4,
  },
  {
    name: "Kunal Singh",
    review: `Pricing is very reasonable compared to other platforms.
There are great offers and discounts available.
Overall, a very satisfying shopping experience.`,
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    review: `The design and layout of the website are modern and attractive.
Everything loads quickly without any lag.
It makes browsing products very enjoyable.`,
    rating: 4,
  },
  {
    name: "Vikram Joshi",
    review: `I was impressed with the packaging quality.
The product arrived safely without any damage.
It shows they really care about customer satisfaction.`,
    rating: 5,
  },
  {
    name: "Meera Kapoor",
    review: `The return process was simple and straightforward.
I received my refund quickly without any complications.
That kind of service builds real trust.`,
    rating: 4,
  },
  {
    name: "Aditya Rao",
    review: `The product descriptions are detailed and accurate.
It helped me make the right decision before purchasing.
Very transparent and honest platform.`,
    rating: 5,
  },
  {
    name: "Ishita Malhotra",
    review: `I have ordered multiple times from this website.
Every time the experience has been smooth and reliable.
Consistency like this keeps customers coming back.`,
    rating: 5,
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    Infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">
        Customer Review
      </h2>
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="p-5">
            <div className="border rounded-lg p-5 ">
                <BsChatQuote size={30} className="mb-3"/>
              <p className="mb-5">{item.review}</p>
              <h4 className="font-semibold">{item.name}</h4>
              <div className="flex mt-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FaStar
                    key={`star${i}`}
                    className="text-yellow-400 size-{20}"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;
