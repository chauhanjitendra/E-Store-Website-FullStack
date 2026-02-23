import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import userIcon from '@/public/assets/images/user.png'
import { useSelector } from "react-redux";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import Link from "next/link";
import LogoutButton from "../LogoutButton";

const UserDropDown = () => {
  const auth = useSelector((store) => store.authStore.auth)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={auth?.avatar?.url || userIcon.src} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mt-2 me-3 w-44'>
        <DropdownMenuLabel>
          <p className="font-semibold">{auth?.name}</p>
          {/* <span className="font-normal text-sm">{auth?.email}</span> */}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='' className="cursor-pointer">
            <IoShirtOutline />
            New Products
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='' className="cursor-pointer">
            <MdOutlineShoppingBag />
            Orders
          </Link>
        </DropdownMenuItem>
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
