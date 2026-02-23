"use client";

import Image from "next/image";
import PlaceholderImage from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import PrintButton from "@/components/Application/website/PrintButton";
import React, { use, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { ADMIN_DASHBOARD, ADMIN_ORDER_SHOW } from "@/routes/AdminPanelRoute";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import Select from "@/components/Application/Select";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, Label: "Home" },
  { href: ADMIN_ORDER_SHOW, Label: "Orders" },
  { href: "", Label: "Orders" },
];

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Unverified", value: "unverified" },
];

const OrderDetails = ({ params }) => {
  const { order_id } = use(params);
  const [orderData, setOrderData] = useState();
  const [OrderStatus, setOrderStatus] = useState();
  const [updatatingStatus, setUpdatingStatus] = useState(false);
  const { data, loading } = useFetch(`/api/orders/get/${order_id}`);

  useEffect(() => {
    if (data && data.success) {
      setOrderData(data.data);
      setOrderStatus(data?.data?.status);
    }
  }, [data]);

  const handleOrderStatus = async () => {
    setUpdatingStatus(true);
    try {
      const { data: response } = await axios.put("/api/orders/update-status", {
        _id: orderData?._id,
        status: OrderStatus,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <div className="lg:px-10 px-4 py-8 max-w-7xl mx-auto">
        {!orderData ? (
          <div className="flex justify-center items-center py-32">
            <h4 className="text-red-500 font-semibold">Order Not Found</h4>
          </div>
        ) : (
          <div className="bg-white dark:bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-gray-50/50 dark:bg-muted/20">
              <h4 className="text-xl text-primary font-bold">Order Details</h4>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Order Information</p>
                  <p className="text-base break-all">
                    <span className="font-semibold text-foreground">Order Id: </span>
                    <span className="text-muted-foreground">{orderData?.order_id}</span>
                  </p>
                  <p className="text-base break-all">
                    <span className="font-semibold text-foreground">Transaction Id: </span>
                    <span className="text-muted-foreground">{orderData?.payment_id}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Status: </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary">
                      {orderData?.status}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 w-full md:w-auto">
                  <PrintButton className="w-full md:w-auto shadow-md" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="border-b bg-gray-50 dark:bg-muted/50 md:table-header-group hidden text-sm">
                    <tr>
                      <th className="text-start p-4 font-semibold text-muted-foreground uppercase">Products</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground uppercase">Price</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground uppercase">Quantity</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderData &&
                      orderData?.products?.map((products) => (
                        <tr
                          key={products.variantId._id}
                          className="md:table-row block py-4 md:py-0"
                        >
                          <td className="md:table-cell p-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16 shrink-0 border rounded-lg overflow-hidden bg-white">
                                <Image
                                  src={
                                    products?.variantId?.media[0]?.secure_url ||
                                    PlaceholderImage.src
                                  }
                                  fill
                                  alt="products"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={WEBSITE_PRODUCT_DETAILS(
                                    products?.productId?.slug,
                                  )}
                                  className="text-base font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                                >
                                  {products?.productId?.name}
                                </Link>
                                <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3 mt-0.5">
                                  <span>Color: <span className="text-foreground">{products?.variantId?.color}</span></span>
                                  <span>Size: <span className="text-foreground">{products?.variantId?.size}</span></span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="md:table-cell flex justify-between md:p-4 px-4 py-1.5 md:text-center">
                            <span className="md:hidden text-sm font-medium text-muted-foreground">Price</span>
                            <span className="text-sm">
                              {products.sellingPrice.toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })}
                            </span>
                          </td>
                          <td className="md:table-cell flex justify-between md:p-4 px-4 py-1.5 md:text-center">
                            <span className="md:hidden text-sm font-medium text-muted-foreground">Quantity</span>
                            <span className="text-sm">{products.qty}</span>
                          </td>
                          <td className="md:table-cell flex justify-between md:p-4 px-4 py-1.5 md:text-center">
                            <span className="md:hidden text-sm font-medium text-muted-foreground uppercase tracking-tight">Total</span>
                            <span className="text-sm font-bold">
                              {(
                                products.qty * products.sellingPrice
                              ).toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mt-12 bg-gray-50/30 dark:bg-muted/5 p-1 rounded-2xl border">
                <div className="p-6">
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Shipping Address
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: "Name", value: orderData?.name },
                      { label: "Email", value: orderData?.email },
                      { label: "Phone", value: orderData?.phone },
                      { label: "Address", value: `${orderData?.city}, ${orderData?.state}, ${orderData?.country}` },
                      { label: "Pincode", value: orderData?.pincode },
                      { label: "LandMark", value: orderData?.landmark },
                      { label: "Order Note", value: orderData?.ordernote },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-wrap justify-between items-start gap-x-4 gap-y-1 py-1 border-b border-gray-100 last:border-0">
                        <span className="text-sm font-medium text-muted-foreground shrink-0">{item.label}</span>
                        <span className="text-sm font-semibold text-end break-all">{item.value || "----"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-card lg:border-l lg:rounded-r-2xl sm:rounded-b-2xl lg:rounded-b-none">
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Order Summary
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="text-sm font-medium">
                        {orderData?.subTotal.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Discount</span>
                      <span className="text-sm font-medium text-green-600">
                        -{orderData?.discount.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-sm text-muted-foreground">Coupon Savings</span>
                      <span className="text-sm font-medium text-green-600">
                        -{orderData?.couponDiscountAmount.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-xl font-bold text-primary break-all">
                        {orderData?.totalAmount.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t space-y-4">
                    <h4 className="text-base font-bold text-foreground">Update Order Status</h4>
                    <Select
                      options={statusOptions}
                      selected={OrderStatus}
                      setSelected={(value) => setOrderStatus(value)}
                      placeholder="Select status..."
                      isMulti={false}
                    />
                    <ButtonLoading
                      type="button"
                      loading={updatatingStatus}
                      onClick={handleOrderStatus}
                      text="Apply New Status"
                      className="w-full mt-2 font-bold py-6 rounded-lg transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
