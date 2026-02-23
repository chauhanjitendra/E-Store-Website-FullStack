import MainSlider from "@/components/Application/website/MainSlider";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import banner1 from "@/public/assets/images/banner1.png";
import banner2 from "@/public/assets/images/banner2.png";
import FeatureProducts from "@/components/Application/website/FeatureProducts";
import advertingBanner from "@/public/assets/images/advertising-banner.png";
import Testimonial from "@/components/Application/website/Testimonial";
import { GiReturnArrow } from "react-icons/gi";
import { MdLocalShipping } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";



const Home = () => {
  return (
    <>
      <section>
        <MainSlider />
      </section>

      <section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
        <div className="grid grid-cols-2 sm:gap-10 gap-2">
          <div className="border rounded-lg overflow-hidden">
            <Link href="">
              <Image
                src={banner1.src}
                width={banner1.width}
                height={banner1.height}
                alt="banner 1"
                className="transition-all hover:scale-110"
              />
            </Link>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Link href="">
              <Image
                src={banner2.src}
                width={banner2.width}
                height={banner2.height}
                alt="banner 2"
                className="transition-all hover:scale-110"
              />
            </Link>
          </div>
        </div>
      </section>

      <FeatureProducts />

      <section className="sm:pt-20 pt-5 pb-10">
        <Image
          src={advertingBanner.src}
          height={advertingBanner.height}
          width={advertingBanner.width}
          alt="advertingBanner"
        />
      </section>
      
      <Testimonial/>
      <section className=" lg:px-32 px-4 border-t py-10 ">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
          <div className="text-center">
            <p className="flex justify-center items-center mb-3">
                <GiReturnArrow size={30}/>
            </p>
            <h3 className="text-xl font-semibold">7-Days Returns</h3>
            <p>Risk-Free Shopping With Easy Returns.</p>
          </div>
          <div className="text-center">
            <p className="flex justify-center items-center mb-3">
                <MdLocalShipping size={30}/>
            </p>
            <h3 className="text-xl font-semibold">Free Shipping</h3>
            <p>No Extra Costs,Just The Price You See.</p>
          </div>
          <div className="text-center">
            <p className="flex justify-center items-center mb-3">
                <MdOutlineSupportAgent size={30}/>
            </p>
            <h3 className="text-xl font-semibold">24/7 Supports</h3>
            <p>24/7 Support,Always Here Just For You.</p>
          </div>
          <div className="text-center">
            <p className="flex justify-center items-center mb-3">
                <CiDiscount1 size={30}/>
            </p>
            <h3 className="text-xl font-semibold">Member Discount</h3>
            <p>Special Offers For Our Loyal Customers.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
