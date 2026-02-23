import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import userIcon from "@/public/assets/images/user.png";

export const DT_CATEGORY_COLUMN = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
];

export const DT_PRODUCT_COLUMN = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount Percentages",
  },
];

export const DT_PRODUCT_VARIANT_COLUMN = [
  {
    accessorKey: "product",
    header: "Product Name",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount Percentages",
  },
];

export const DT_COUPON_COLUMN = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount Percentages",
  },
  {
    accessorKey: "minShoppingAmount",
    header: "Min Shopping Amount",
  },
  {
    accessorKey: "validity",
    header: "Validity",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      const formattedDate = dayjs(value).format("DD/MM/YYYY");
      return new Date() > new Date(value) ? (
        <Chip color="error" label={formattedDate} />
      ) : (
        <Chip color="success" label={formattedDate} />
      );
    },
  },
];

export const DT_CUSTOMERS_COLUMN = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    Cell: ({ renderedCellValue }) => (
      <Avatar>
        <AvatarImage src={renderedCellValue?.url || userIcon.src} />
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isEmailVerified",
    header: "Is Verified",
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not Verified" />
      ),
  },
];

export const DT_REVIEW_COLUMN = [
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
];

export const DT_ORDER_COLUMN = [
  {
    accessorKey: "order_id",
    header: "Order Id",
  },
  {
    accessorKey: "payment_id",
    header: "Payment Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "pincode",
    header: "Pincode",
  },
  {
    accessorKey: "products",
    header: "Total Item",
    Cell: ({ renderedCellValue }) => (
      <span>{renderedCellValue?.length || 0}</span>
    ),
  },
  {
    accessorKey: "subTotal",
    header: "SubTotal",
  },
  {
    accessorKey: "discount",
    header: "Discount",
    Cell: ({ renderedCellValue }) => (
      <span>{Math.round(renderedCellValue)}</span>
    ),
  },
  {
    accessorKey: "couponDiscountAmount",
    header: "Coupon Discount",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
