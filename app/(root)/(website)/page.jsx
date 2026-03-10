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
import MotionSection from "@/components/Application/website/MotionSection";
import WhatsAppButton from "@/components/Application/website/WhatsAppButton";
import CallButton from "@/components/Application/website/CallButton";

const Home = () => {
  return (
    <>
      <section>
        <MainSlider />
      </section>

      <MotionSection className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
        <div className="grid grid-cols-2 sm:gap-10 gap-2">
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link href="">
              <Image
                src={banner1.src}
                width={banner1.width}
                height={banner1.height}
                alt="banner 1"
                className="transition-all hover:scale-105 duration-500"
              />
            </Link>
          </div>
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link href="">
              <Image
                src={banner2.src}
                width={banner2.width}
                height={banner2.height}
                alt="banner 2"
                className="transition-all hover:scale-105 duration-500"
              />
            </Link>
          </div>
        </div>
      </MotionSection>

      <FeatureProducts />

      <MotionSection className="lg:px-32 px-4 sm:pt-16 pt-8 pb-12">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/15 via-white to-primary/10 shadow-lg">
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm animate-pulse">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span>Today&apos;s Exclusive Deal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug">
                Grab up to{" "}
                <span className="text-primary drop-shadow-sm">50% OFF</span>{" "}
                on top picks
              </h2>

              <p className="max-w-xl text-sm sm:text-base text-gray-600">
                Limited time mega sale on our most loved products. Don&apos;t
                miss out on the best prices of the season.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                    Coupon
                  </span>
                  <span className="font-mono text-sm">MEGA50</span>
                </div>
                <div className="rounded-xl bg-white/80 px-4 py-2 text-xs sm:text-sm text-gray-600 shadow-sm">
                  Free shipping on orders above ₹999
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
                <div className="rounded-2xl bg-white/90 px-3 py-2 shadow-sm transform hover:-translate-y-1 transition-transform duration-300">
                  <p className="font-bold text-lg sm:text-xl text-primary">
                    02
                  </p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                    Days
                  </p>
                </div>
                <div className="rounded-2xl bg-white/90 px-3 py-2 shadow-sm transform hover:-translate-y-1 transition-transform duration-300 delay-75">
                  <p className="font-bold text-lg sm:text-xl text-primary">
                    12
                  </p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                    Hours
                  </p>
                </div>
                <div className="rounded-2xl bg-white/90 px-3 py-2 shadow-sm transform hover:-translate-y-1 transition-transform duration-300 delay-150">
                  <p className="font-bold text-lg sm:text-xl text-primary">
                    45
                  </p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                    Mins
                  </p>
                </div>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:bg-primary/90 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop the Offer Now
              </Link>

              <p className="text-[11px] text-gray-500">
                *No minimum cart value required. Offer valid for a limited time
                only.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="sm:pt-20 pt-5 pb-10">
        <Image
          src={advertingBanner.src}
          height={advertingBanner.height}
          width={advertingBanner.width}
          alt="advertingBanner"
          className="w-full"
        />
      </MotionSection>

      <Testimonial />

      <MotionSection className=" lg:px-32 px-4 border-t py-10 ">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
          <div className="text-center group">
            <p className="flex justify-center items-center mb-3 group-hover:scale-110 transition-transform duration-300 text-primary">
              <GiReturnArrow size={30} />
            </p>
            <h3 className="text-xl font-semibold">7-Days Returns</h3>
            <p className="text-gray-500">Risk-Free Shopping With Easy Returns.</p>
          </div>
          <div className="text-center group">
            <p className="flex justify-center items-center mb-3 group-hover:scale-110 transition-transform duration-300 text-primary">
              <MdLocalShipping size={30} />
            </p>
            <h3 className="text-xl font-semibold">Free Shipping</h3>
            <p className="text-gray-500">No Extra Costs,Just The Price You See.</p>
          </div>
          <div className="text-center group">
            <p className="flex justify-center items-center mb-3 group-hover:scale-110 transition-transform duration-300 text-primary">
              <MdOutlineSupportAgent size={30} />
            </p>
            <h3 className="text-xl font-semibold">24/7 Supports</h3>
            <p className="text-gray-500">24/7 Support,Always Here Just For You.</p>
          </div>
          <div className="text-center group">
            <p className="flex justify-center items-center mb-3 group-hover:scale-110 transition-transform duration-300 text-primary">
              <CiDiscount1 size={30} />
            </p>
            <h3 className="text-xl font-semibold">Member Discount</h3>
            <p className="text-gray-500">Special Offers For Our Loyal Customers.</p>
          </div>
        </div>
      </MotionSection>

      <WhatsAppButton />
      <CallButton />
    </>
  );
};

export default Home;
