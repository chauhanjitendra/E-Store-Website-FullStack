"use client";

import ThemeSwitch from "./ThemeSwitch";
import UserDropDown from "./UserDropDown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import logoblack from "@/public/assets/images/logo-black.png";
import logowhite from "@/public/assets/images/logo-white.png";
import Image from "next/image";
import AdminMobileSearch from "./AdminMobileSearch";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed border h-14 w-full top-0 left-0 z-0 md:ps-72 md:pe-5 px-5 flex justify-between items-center dark:bg-card">
      <div className="flex items-center md:hidden">
        <Image
          src={logoblack.src}
          height={50}
          width={logoblack.width}
          className="block dark:hidden h-[50px] w-auto"
          alt="logo-dark"
        ></Image>
        <Image
          src={logowhite.src}
          height={50}
          width={logowhite.width}
          className="hidden dark:block h-[50px] w-auto"
          alt="logo-white"
        ></Image>
      </div>
      <div className="md:block hidden">
        <AdminSearch />
      </div>
      <div className="flex items-center gap-2">
        <AdminMobileSearch/>
        <ThemeSwitch />
        <UserDropDown />
        <Button
          onClick={toggleSidebar}
          type="button"
          size="icon"
          className="ms-2 md:hidden"
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
