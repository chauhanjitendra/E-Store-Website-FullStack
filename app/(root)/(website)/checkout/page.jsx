"use client";
import ButtonLoading from "@/components/Application/ButtonLoading";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import {
  WEBSITE_ORDER_DETAILS,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import { addIntoCart, cleareCart } from "@/store/reducer/cartReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdLocalShipping } from "react-icons/md";
import z, { success } from "zod";
import { Textarea } from "@/components/ui/textarea";
import Script from "next/script";
import { useRouter } from "next/navigation";
import loading from "@/public/assets/images/loading.svg";


const bredCrumb = {
  title: "Checkout",
  links: [{ label: "Checkout" }],
};
const CheckOut = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore.auth);
  const [verifiedCartData, setVerifiedCartData] = useState([]);
  const [isCouponApplied, setCouponApplied] = useState(false);
  const [subTotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscountAmount, setcouponDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const { data: getVerifiedCartData } = useFetch(
    "/api/cart-verification",
    "POST",
    { data: cart.products },
  );

  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data;
      setVerifiedCartData(cartData);
      dispatch(cleareCart());

      cartData.forEach((cartItem) => {
        dispatch(addIntoCart(cartItem));
      });
    }
  }, [getVerifiedCartData]);

  useEffect(() => {
    const cartProducts = cart.products;
    const subTotalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0,
    );
    const discount = cartProducts.reduce(
      (sum, product) =>
        sum + (product.mrp - product.sellingPrice) * product.qty,
      0,
    );

    setSubtotal(subTotalAmount);
    setDiscount(discount);
    setTotalAmount(subTotalAmount);

    couponForm.setValue("minShoppingAmount", subTotalAmount);
  }, [cart]);

  //  coupon form

  const couponFromSchema = zSchema.pick({
    code: true,
    minShoppingAmount: true,
  });

  const couponForm = useForm({
    resolver: zodResolver(couponFromSchema),
    defaultValues: {
      code: "",
      minShoppingAmount: subTotal,
    },
  });

  const applyCoupon = async (Values) => {
    setCouponApplied(true);
    try {
      const { data: response } = await axios.post("/api/coupon/apply", Values);
      if (!response.success) {
        throw new Error(response.message);
      }
      const discountPercentage = response.data.discountPercentage;
      // get coupon discount amount
      setcouponDiscountAmount((subTotal * discountPercentage) / 100);
      setTotalAmount(subTotal - (subTotal * discountPercentage) / 100);

      showToast("success", response.message);
      setCouponCode(couponForm.getValues("code"));
      setCouponApplied(true);
      couponForm.resetField("code", "");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
    setcouponDiscountAmount(0);
    setTotalAmount(subTotal);
  };

  // place order
  const orderFromSchema = zSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      ordernote: true,
    })
    .extend({
      userId: z.string().optional(),
    });

  const orderFrom = useForm({
    resolver: zodResolver(orderFromSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      ordernote: "",
      userId: auth?._id,
    },
  });

  useEffect(() => {
    if (auth?._id) {
      orderFrom.setValue("userId", auth._id);
    }
  }, [auth]);

  useEffect(() => {
    if (auth?._id) {
      orderFrom.setValue("userId", auth._id);
    }
  }, [auth]);

  // get order id
  const getOrderId = async (amount) => {
    try {
      const { data: orderIdData } = await axios.post(
        "/api/payment/get-order-id",
        { amount },
      );
      if (!orderIdData.success) {
        throw new Error(orderIdData.message);
      }
      return { success: true, order_id: orderIdData.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const placeOrder = async (formData) => {
    setPlacingOrder(true);
    try {
      const generateOrderId = await getOrderId(totalAmount);
      if (!generateOrderId.success) {
        throw new Error(generateOrderId.message);
      }
      const order_id = generateOrderId.order_id;
      const razOption = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: "E-Commerce",
        description: "Payment For Order",
        image:
          "https://res.cloudinary.com/dcxg2c8is/image/upload/v1771606579/logo-black_pzg6lf.webp",
        order_id: order_id,
        handler: async function (response) {
          setSavingOrder(true);
          const products = verifiedCartData.map((cartItem) => ({
            productId: cartItem.productId,
            variantId: cartItem.variantId,
            name: cartItem.name,
            qty: cartItem.qty,
            mrp: cartItem.mrp,
            sellingPrice: cartItem.sellingPrice,
          }));

          const { data: paymentResponseData } = await axios.post(
            "/api/payment/save-order",
            {
              ...formData,
              ...response,
              products: products,
              subTotal: subTotal,
              discount: discount,
              couponDiscountAmount: couponDiscountAmount,
              totalAmount: totalAmount,
              userId: auth?._id
            },
          );

          if (paymentResponseData.success) {
            showToast("success", paymentResponseData.message);
            dispatch(cleareCart());
            orderFrom.reset();
            router.push(WEBSITE_ORDER_DETAILS(response.razorpay_order_id));
            setSavingOrder(false);
          } else {
            showToast("error", paymentResponseData.message);
            setSavingOrder(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new Razorpay(razOption);
      rzp.on("payment.failed", function (response) {
        showToast("error", response.error.description);
      });

      rzp.open();
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      {savingOrder && (
        <div className="h-screen w-screen fixed top-0 left-0 z-50 bg-black/10">
          <div className="h-screen flex justify-center items-center">
            <Image src={loading.src} height={80} width={80} alt="loading"></Image>
            <h4 className="font-semibold">Order Confirmin....</h4>
          </div>
        </div>
      )}
      <WebsiteBreadcrumb props={bredCrumb} />
      {cart.count === 0 ? (
        <div className="w-screen h-[500px] flex justify-center items-center py-32">
          <div className="text-center">
            <h4 className="text-4xl font-semibold mb-5">Your Cart Is Empty!</h4>
            <Button type="button" asChild>
              <Link href={WEBSITE_SHOP}>Countinue Shoppings</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4">
          <div className="lg:w-[60%] w-full">
            <div className="flex font-semibold gap-2 items-center">
              <MdLocalShipping size={35} /> Shipping Address:
            </div>
            <div className="mt-5">
              <Form {...orderFrom}>
                <form
                  className="grid grid-cols-2 gap-5"
                  onSubmit={orderFrom.handleSubmit(placeOrder)}
                >
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="FullName*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email-Address*"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Number*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="country*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="State*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="City*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Pincode*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={orderFrom.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="LandMark*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3 col-span-2">
                    <FormField
                      control={orderFrom.control}
                      name="ordernote"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your OrderNote*"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <ButtonLoading
                      type="submit"
                      text="Place Order"
                      loading={placingOrder}
                      className="bg-black rounded-full px-5 cursor-pointer"
                    />
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className="lg:w-[40%] w-full">
            <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
            <div>
              <table className="w-full border">
                <tbody>
                  {verifiedCartData &&
                    verifiedCartData?.map((product) => (
                      <tr key={product.variantId}>
                        <td className="p-3">
                          <div className="flex items-center gap-5">
                            <Image
                              src={product.media}
                              width={60}
                              height={60}
                              alt={product.name}
                              className="rounded"
                            />
                            <div>
                              <h4 className="font-medium line-clamp-1">
                                <Link
                                  href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                >
                                  {product.name}
                                </Link>
                              </h4>
                              <p className="text-sm">Color: {product.color}</p>
                              <p className="text-sm">Size: {product.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <p className="text-nowrap text-sm">
                            {product.qty} x{" "}
                            {product.sellingPrice.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })}
                          </p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-medium py-2">Subtotal</td>
                    <td className="text-end py-2">
                      {subTotal.toLocaleString("en-In", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2">Discount</td>
                    <td className="text-end py-2">
                      -{" "}
                      {discount.toLocaleString("en-In", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2">Coupon Discount</td>
                    <td className="text-end py-2">
                      -{" "}
                      {couponDiscountAmount.toLocaleString("en-In", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2 text-xl">Total</td>
                    <td className="text-end py-2">
                      {totalAmount.toLocaleString("en-In", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-2 mb-5">
                {!isCouponApplied ? (
                  <Form {...couponForm}>
                    <form
                      className="flex justify-between gap-5"
                      onSubmit={couponForm.handleSubmit(applyCoupon)}
                    >
                      <div className="w-[calc(100%-100px)]">
                        <FormField
                          control={couponForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Enter Coupon Code"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        ></FormField>
                      </div>
                      <div className="w-[100px]">
                        <ButtonLoading
                          type="submit"
                          text="Apply"
                          className="w-full cursor-pointer"
                          loading={couponLoading}
                        />
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="flex justify-between py-1 px-5 rounded-lg bg-gray-200">
                    <div>
                      <span className="text-xs">Coupon:</span>
                      <p className="text-sm font-semibold">{couponCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-500 cursor-pointer"
                    >
                      <IoCloseCircle size={25} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
      )}
    </div>
  );
};

export default CheckOut;
