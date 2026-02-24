'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logoblack from "@/public/assets/images/logo-black.png";
import logowhite from "@/public/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar className='z-[100]'>
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center px-2">
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
          <Button onClick={toggleSidebar} type="button" size="icon" className="md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            menu.submenu && menu.submenu.length > 0 ? (
              <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild className='font-semibold px-2 py-5'>
                      <Link href={menu?.url}>
                        <menu.icons />
                        {menu.title}
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((submenuItem, subMenuIndex) => (
                        <SidebarMenuSubItem key={subMenuIndex}>
                          <SidebarMenuSubButton asChild className='px-2 py-5'>
                            <Link href={submenuItem.url}>
                              {submenuItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild className='font-semibold px-2 py-5'>
                  <Link href={menu?.url}>
                    <menu.icons />
                    {menu.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )

          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
