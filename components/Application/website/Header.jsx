"use client";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Link from "next/link";
import React, { useState } from "react";
import Logo from "../Logo";
import { FaSearch } from "react-icons/fa";
import Cart from "./Cart";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import userIcon from "@/public/assets/images/user.png";
import { FaBars } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import Search from "./Search";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="bg-white border-b lg:px-32 px-4 shadow-sm">
        <div className="flex justify-between items-center lg:py-5 py-3">
          <Link href={WEBSITE_HOME}>
            <Logo className="lg:scale-100 scale-75" />
          </Link>
          <div className="flex justify-between gap-20">
            <AnimatePresence>
              {isMobileMenu && (
                <motion.nav
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="bg-white fixed z-[100] top-0 left-0 w-full transition-all h-screen shadow-2xl"
                >
                  <div className="flex justify-between items-center bg-gray-50 py-3 border-b px-4">
                    <Logo className="lg:scale-100 scale-75" />
                    <button type="button" onClick={() => setIsMobileMenu(false)}>
                      <IoCloseSharp
                        size={25}
                        className="text-gray-500 hover:text-primary"
                      />
                    </button>
                  </div>

                  <ul className="flex flex-col gap-5 p-6">
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-gray-600 hover:text-primary hover:font-semibold border-b pb-2"
                    >
                      <Link href={WEBSITE_HOME} className="block text-lg" onClick={() => setIsMobileMenu(false)}>
                        Home
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 hover:text-primary hover:font-semibold border-b pb-2"
                    >
                      <Link href="/about-us" className="block text-lg" onClick={() => setIsMobileMenu(false)}>
                        About
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-600 hover:text-primary hover:font-semibold border-b pb-2"
                    >
                      <Link href={WEBSITE_SHOP} className="block text-lg" onClick={() => setIsMobileMenu(false)}>
                        Shop
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 hover:text-primary hover:font-semibold border-b pb-2"
                    >
                      <Link href={`${WEBSITE_SHOP}?category=t-shirt`} className="block text-lg" onClick={() => setIsMobileMenu(false)}>
                        T-shirt
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-600 hover:text-primary hover:font-semibold border-b pb-2"
                    >
                      <Link href={`${WEBSITE_SHOP}?category=hoodies`} className="block text-lg" onClick={() => setIsMobileMenu(false)}>
                        Hoodies
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-gray-600 hover:text-primary hover:font-semibold border-b pb-2"
                    >
                      <Link href={`${WEBSITE_SHOP}?category=oversized`} className="block text-lg" onClick={() => setIsMobileMenu(false)}>
                        Oversized
                      </Link>
                    </motion.li>
                  </ul>
                </motion.nav>
              )}
            </AnimatePresence>

            <nav className="hidden lg:block">
              <ul className="flex flex-row justify-between items-center gap-10">
                <li className="text-gray-600 hover:text-primary hover:font-semibold transition-colors duration-300">
                  <Link href={WEBSITE_HOME} className="block py-2">
                    Home
                  </Link>
                </li>
                <li className="text-gray-600 hover:text-primary hover:font-semibold transition-colors duration-300">
                  <Link href="/about-us" className="block py-2">
                    About
                  </Link>
                </li>
                <li className="text-gray-600 hover:text-primary hover:font-semibold transition-colors duration-300">
                  <Link href={WEBSITE_SHOP} className="block py-2">
                    Shop
                  </Link>
                </li>
                <li className="text-gray-600 hover:text-primary hover:font-semibold transition-colors duration-300">
                  <Link href={`${WEBSITE_SHOP}?category=t-shirt`} className="block py-2">
                    T-shirt
                  </Link>
                </li>
                <li className="text-gray-600 hover:text-primary hover:font-semibold transition-colors duration-300">
                  <Link href={`${WEBSITE_SHOP}?category=hoodies`} className="block py-2">
                    Hoodies
                  </Link>
                </li>
                <li className="text-gray-600 hover:text-primary hover:font-semibold transition-colors duration-300">
                  <Link href={`${WEBSITE_SHOP}?category=oversized`} className="block py-2">
                    Oversized
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex justify-between items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaSearch className="text-gray-500 hover:text-primary cursor-pointer size-{25} text-xl" />
              </motion.button>
              <Cart />

              {!auth ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href={WEBSITE_LOGIN}
                    className="text-gray-500 hover:text-primary cursor-pointer size-{25} text-xl"
                  >
                    <VscAccount />
                  </Link>
                </motion.div>
              ) : (
                <Link href={USER_DASHBOARD}>
                  <Avatar className="hover:ring-2 ring-primary transition-all duration-300">
                    <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                  </Avatar>
                </Link>
              )}

              <button
                type="button"
                className="lg:hidden block"
                onClick={() => setIsMobileMenu(true)}
              >
                <FaBars
                  size={25}
                  className="text-gray-500 hover:text-primary"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Search isShow={showSearch} />
    </motion.div>
  );
};

export default Header;
