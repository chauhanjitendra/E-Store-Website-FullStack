'use client'

import ThemeSwitch from "./ThemeSwitch";
import UserDropDown from "./UserDropDown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";

const TopBar = () => {
  const {toggleSidebar} =useSidebar()
  return (
    <div className="fixed border h-14 w-full top-0 left-0 z-0 md:ps-72 md:pe-5 px-5 flex justify-between items-center dark:bg-card">
      <div>searchbar components</div>
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <UserDropDown />
        <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">
          <RiMenu4Fill/>
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
