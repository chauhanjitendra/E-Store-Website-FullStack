// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";


export const adminAppSidebarMenu =[
    {
        title: 'Dashboard',
        url :ADMIN_DASHBOARD,
        icons: AiOutlineDashboard,
    },
    {
        title: 'Category',
        url :"#",
        icons: BiCategory,
        submenu:[
            {
                title : "Add Category",
                url:"#"
            },
            {
                title:"All Category",
                url:"#"
            }
        ]
    },
    {
        title: 'Products',
        url :"#",
        icons: IoShirtOutline,
        submenu:[
            {
                title : "Add Products",
                url:"#"
            },
            {
                title:"All Variant",
                url:"#"
            },
            {
                title:"All Products",
                url:"#"
            },
            {
                title:"Products Variants",
                url:"#"
            },
        ]
    },
    {
        title: 'Coupons',
        url :"#",
        icons: RiCoupon2Line,
        submenu:[
            {
                title : "Add Coupons",
                url:"#"
            },
            {
                title:"All Coupons",
                url:"#"
            },
        ]
    },
    {
        title: 'Orders',
        url :"#",
        icons: MdOutlineShoppingBag,
    },
    {
        title: 'Customers',
        url :"#",
        icons: LuUserRound,
    },
    {
        title: 'Rating & Review',
        url :"#",
        icons: IoMdStarOutline,
    },
    {
        title: 'Media',
        url :ADMIN_MEDIA_SHOW,
        icons: MdOutlinePermMedia,
    },
]