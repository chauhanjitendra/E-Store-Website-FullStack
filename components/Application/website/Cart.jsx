"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { removeFromCart } from "@/store/reducer/cartReducer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoute";
import { showToast } from "@/lib/showToast";
import { IoCartOutline } from "react-icons/io5";

const Cart = () => {
  const [open, setOpen] = useState(false);
  const [subTotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCartIconClick = (e) => {
    if (!auth) {
      e.preventDefault();
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    const cartProducts = cart.products;
    const totalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0,
    );
    const discount = cartProducts.reduce(
      (sum, product) =>
        sum + (product.mrp - product.sellingPrice) * product.qty,
      0,
    );

    setSubtotal(totalAmount);
    setDiscount(discount);
  }, [cart]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative"
          type="button"
          onClick={handleCartIconClick}
        >
          <IoCartOutline size={25} className="text-gray-500 hover:text-primary" />
          <span className="absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1">
            {cart.count}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent className='sm:max-w-[450px] w-full'>
        <SheetHeader className="py-2">
          <SheetTitle className="text-2xl">My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100vh-40px)] pb-10">
          <div className="h-[calc(100%-128px)] overflow-auto px-2">
            {cart.count === 0 && (
              <div className="h-full flex items-center justify-center text-xl font-semibold">
                Your Cart Is Empty..
              </div>
            )}

            {cart.products?.map((product) => (
              <div
                key={product.variantId}
                className="flex justify-between items-center gap-5 mb-4 border-b pb-4"
              >
                <div className="flex gap-5 items-center">
                  <Image
                    src={product.media || imgPlaceholder}
                    height={100}
                    width={100}
                    alt={product.name}
                    className="w-20 h-20 rounded"
                  />

                  <div>
                    <h4>{product.name}</h4>
                    <p className="text-gray-500">
                      {product.size} /{product.color}
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: product.productId,
                          variantId: product.variantId,
                        }),
                      )
                    }
                    type="button"
                    className="text-red-500 underline underline-offset-1 mb-2 cursor-pointer"
                  >
                    Remove
                  </button>
                  <p className="font-semibold">
                    {product.qty} X{" "}
                    {product.sellingPrice.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-32 border-t pt-5 px-2">
            <h2 className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal</span>{" "}
              <span>
                {subTotal?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </h2>
            <h2 className="flex justify-between items-center text-lg font-semibold">
              <span>DisCount</span>{" "}
              <span>
                {discount?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </h2>

            <div className="flex justify-between gap-5 mt-3">
              {/* <Button
                type="button"
                asChild
                variant="secondary"
                className="w-[170px]"
              >
                <Link href={WEBSITE_CART}>View Cart</Link>
              </Button> */}
              <Button asChild variant="secondary" className="w-[170px]">
                <SheetClose asChild>
                  <Link href={WEBSITE_CART}>View Cart</Link>
                </SheetClose>
              </Button>
              <Button
                type="button"
                asChild
                onClick={() => setOpen(false)}
                className="w-[170px]"
              >
                {cart.count ? (
                  <Link href={WEBSITE_CHECKOUT}>Check Out</Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => showToast("error", "your Cart Is Empty!")}
                  >
                    Checkout
                  </button>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
