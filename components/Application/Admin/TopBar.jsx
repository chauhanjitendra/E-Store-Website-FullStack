"use client";

import ThemeSwitch from "./ThemeSwitch";
import UserDropDown from "./UserDropDown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import Logo from "../Logo";
import AdminMobileSearch from "./AdminMobileSearch";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed border-b h-14 w-full top-0 left-0 z-50 md:ps-64 md:pe-5 px-5 flex justify-between items-center bg-background dark:bg-card">
      <div className="flex items-center md:hidden">
        <Logo variant="dark" className="block dark:hidden" />
        <Logo variant="light" className="hidden dark:block" />
      </div>
      <div className="md:block hidden pl-5">
        <AdminSearch />
      </div>
      <div className="flex items-center gap-2">
        <AdminMobileSearch />
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
