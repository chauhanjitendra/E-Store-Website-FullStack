'use client'

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { IoIosMoon } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

const UserDropDown = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" className="cursor-pointer">
          <IoSunny className="dark:hidden" />
          <IoIosMoon className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={()=> setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={()=> setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={()=> setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
