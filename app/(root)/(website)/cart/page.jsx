"use client";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import { WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/store/reducer/cartReducer";

const bredCrumb = {
  title: "Cart",
  links: [{ label: "Cart" }],
};
const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const [subTotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);

 

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
    <div>
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
          <div className="lg:w-[70%] w-full">
            <table className="w-full border">
              <thead className="border-b bg-gray-50 md:table-header-group hidden">
                <tr>
                  <th className="text-start p-3">Product</th>
                  <th className="text-start p-3">Price</th>
                  <th className="text-start p-3 pl-10">Quantity</th>
                  <th className="text-start p-3">Total</th>
                  <th className="text-start p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map((products) => (
                  <tr
                    key={products.variantId}
                    className="md:table-row block border-b"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-5">
                        <Image
                          src={products.media || imgPlaceholder.src}
                          width={60}
                          height={60}
                          alt={products.name}
                        />
                        <div>
                          <h4 className="text-lg font-medium line-clamp-1">
                            <Link href={WEBSITE_PRODUCT_DETAILS(products.url)}>
                              {products.name}
                            </Link>
                          </h4>
                          <p className="text-sm">Color:{products.color}</p>
                          <p className="text-sm">Size:{products.size}</p>
                        </div>
                      </div>
                    </td>

                    <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-start">
                      <span className="md:hidden font-medium">Price</span>
                      <span>
                        {products.sellingPrice.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </td>

                    <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2">
                      <span className="md:hidden font-medium">Quantity</span>
                      <div>
                        <div className="flex justify-center items-center md:h-10 h-7 border w-fit rounded-full">
                          <button
                            type="button"
                            className="h-full w-10 justify-center items-center px-3 cursor-pointer"
                            onClick={() => dispatch(decreaseQuantity({
                              productId: products.productId,
                              variantId: products.variantId,
                            }))}
                          >
                            <HiMinus />
                          </button>
                          <input
                            type="text"
                            value={products.qty}
                            className="md:w-14 w-8 text-center border-none outline-offset-0"
                            readOnly
                          />
                          <button
                            type="button"
                            className="h-full w-10 justify-center items-center px-3 cursor-pointer"
                           onClick={() => dispatch(increaseQuantity({
                              productId: products.productId,
                              variantId: products.variantId,
                            }))}
                          >
                            <HiPlus />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="md:table-cell flex md:p-3 justify-between px-3 pb-2 text-center">
                      <span className="md:hidden font-medium">Total</span>
                      <span>
                        {(products.sellingPrice * products.qty).toLocaleString('en-IN',{style: 'currency', currency: 'INR'})}
                      </span>
                    </td>
                    <td className="md:table-cell flex md:p-3 justify-between px-3 pb-2 text-center">
                      <span className="md:hidden font-medium">Remove</span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: products.productId,
                              variantId: products.variantId,
                            }),
                          )
                        }
                        className="text-red-500 cursor-pointer"
                      >
                        <IoMdCloseCircleOutline size={25}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:w-[30%] w-full">
            <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-medium py-2">Subtotal</td>
                    <td className="text-end py-2">
                      {subTotal.toLocaleString('en-In',{style: 'currency', currency: 'INR'})}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2">Discount</td>
                    <td className="text-end py-2">
                      -{discount.toLocaleString('en-In',{style: 'currency', currency: 'INR'})}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2">Total</td>
                    <td className="text-end py-2">
                      {subTotal.toLocaleString('en-In',{style: 'currency', currency: 'INR'})}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Button type='button' asChild className='w-full bg-black rounded-full mt-5 mb-3'>
                <Link href={WEBSITE_CHECKOUT}>Proceed To Checkout</Link>
              </Button>

              <p className="text-center">
                <Link href={WEBSITE_SHOP} className="hover:underline">Continue Shopping</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
