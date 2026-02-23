import Image from "next/image";
import React from "react";
import logo from "@/public/assets/images/logo-black.png";
import Link from "next/link";
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdFacebook } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";




const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4">
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Image
            src={logo}
            width={383}
            height={146}
            alt="logo"
            className="w-36 mb-2"
          />
          <p className="text-gary-500 text-sm">
            E-Store is your trusted destination for quality and convenience.
            from fashion to essential, we bring everything you need right to
            your doorstep. Shop smart, live better-only at E-Store
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Categories</h4>
              <ul>
                <li className="mb-2 text-gray-500">
                  <Link href={`${WEBSITE_SHOP}?category=t-shirts`}>T-Shirt</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={`${WEBSITE_SHOP}?category=hoodies`}>Hoodies</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={`${WEBSITE_SHOP}?category=oversized`}>OverSized</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={`${WEBSITE_SHOP}?category=full-sleeves`}>Full-Sleeves</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={`${WEBSITE_SHOP}?category=polo`}>Polo</Link>
                </li>
              </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Usefull Links</h4>
              <ul>
                <li className="mb-2 text-gray-500">
                  <Link href={WEBSITE_HOME}>Home</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={WEBSITE_SHOP}>Shop</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href='/about-us'>About</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={WEBSITE_REGISTER}>Register</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={WEBSITE_LOGIN}>Login</Link>
                </li>
              </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Help Center</h4>
              <ul>
                <li className="mb-2 text-gray-500">
                  <Link href={WEBSITE_REGISTER}>Register</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={WEBSITE_LOGIN}>Login</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href={USER_DASHBOARD}>My Account</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href='/privacy-policy'>Privacy Policy</Link>
                </li>
                <li className="mb-2 text-gray-500">
                  <Link href='/term-and-conditions'>Terms & Condition</Link>
                </li>
              </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Contact Us</h4>
              <ul>
                <li className="mb-2 text-gray-500 flex gap-2">
                 <FaLocationDot size={20}/>
                 <span className="text-sm">E-Store market Ahmedabad,India 363030</span>
                </li>
                <li className="mb-2 text-gray-500 flex gap-2">
                 <FaPhoneAlt size={20}/>
                 <Link href='Tel: +91-77790 96802' className="hover:text-primary text-sm">+91-77790 96802</Link>
                </li>
                <li className="mb-2 text-gray-500 flex gap-2">
                 <MdOutlineMail size={20}/>
                 <Link href='maileto:chauhanjitendra@gmail.com: +91-77790 96802' className="hover:text-primary text-sm">chauhan@gmail.com</Link>
                </li>
              </ul>
              <div className="flex gap-5 mt-5">
                <Link href=''><FaYoutube className="text-primary" size={25}/></Link>
                <Link href=''><FaInstagram className="text-primary" size={25}/></Link>
                <Link href=''><FaWhatsapp className="text-primary" size={25}/></Link>
                <Link href=''><MdFacebook className="text-primary" size={25}/></Link>
                <Link href=''><FaTwitter className="text-primary" size={25}/></Link>

              </div>
        </div>
      </div>

      <div className="py-5 bg-gray-100">
        <p className="text-center">@ 2026 Estore. All Right Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;


