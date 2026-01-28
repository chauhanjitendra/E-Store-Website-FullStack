// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_COUPON_ADD,
  ADMIN_COUPON_SHOW,
  ADMIN_CUSTOMER_SHOW,
  // ADMIN_REVIEW_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_REVIEW_SHOW,
} from "@/routes/AdminPanelRoute";

export const adminAppSidebarMenu = [
  {
    title: "Dashboard",
    url: ADMIN_DASHBOARD,
    icons: AiOutlineDashboard,
  },
  {
    title: "Category",
    url: "#",
    icons: BiCategory,
    submenu: [
      {
        title: "Add Category",
        url: ADMIN_CATEGORY_ADD,
      },
      {
        title: "All Category",
        url: ADMIN_CATEGORY_SHOW,
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icons: IoShirtOutline,
    submenu: [
      {
        title: "Add Products",
        url: ADMIN_PRODUCT_ADD,
      },
      {
        title: "Add Variant",
        url: ADMIN_PRODUCT_VARIANT_ADD,
      },
      {
        title: "All Products",
        url: ADMIN_PRODUCT_SHOW,
      },
      {
        title: "Products Variants",
        url: ADMIN_PRODUCT_VARIANT_SHOW,
      },
    ],
  },
  {
    title: "Coupons",
    url: "#",
    icons: RiCoupon2Line,
    submenu: [
      {
        title: "Add Coupons",
        url: ADMIN_COUPON_ADD,
      },
      {
        title: "All Coupons",
        url: ADMIN_COUPON_SHOW,
      },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icons: MdOutlineShoppingBag,
  },
  {
    title: "Customers",
    url: ADMIN_CUSTOMER_SHOW,
    icons: LuUserRound,
  },
  {
    title: "Rating & Review",
    url: ADMIN_REVIEW_SHOW,
    icons: IoMdStarOutline,
  },
  {
    title: "Media",
    url: ADMIN_MEDIA_SHOW,
    icons: MdOutlinePermMedia,
  },
];
