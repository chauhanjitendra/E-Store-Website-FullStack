"use client";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import { WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/store/reducer/cartReducer";
import { motion, AnimatePresence } from "framer-motion";
import { FaBagShopping, FaArrowRightLong, FaBolt } from "react-icons/fa6";
import { LuTrash2, LuSparkles, LuShieldCheck, LuTruck } from "react-icons/lu";

const bredCrumb = {
  title: "Cart",
  links: [{ label: "Cart" }],
};

const CartPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    if (!document.cookie.includes("access_token=")) {
      router.push("/auth/login");
    }
  }, [router]);

  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const [subTotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const FREE_SHIPPING_THRESHOLD = 5000;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative min-h-screen">
      {/* Universe Layer: Atmospheric Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-purple-100 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        <WebsiteBreadcrumb props={bredCrumb} />

        {/* Infinity Layer: Prestige Free Shipping Bar */}
        {cart.count > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:mx-32 mx-4 mt-6 p-6 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white shadow-xl shadow-primary/5 flex flex-col gap-4 overflow-hidden relative"
          >
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <LuTruck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">
                    {subTotal >= FREE_SHIPPING_THRESHOLD
                      ? "Complimentary Prestige Shipping Unlocked"
                      : `Add ₹${(FREE_SHIPPING_THRESHOLD - subTotal).toLocaleString()} for Free Shipping`}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Priority Handling Included</p>
                </div>
              </div>
              <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase">
                {Math.min(100, (subTotal / FREE_SHIPPING_THRESHOLD) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100/50 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (subTotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] relative"
              >
                <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-r from-transparent to-white/30 animate-shimmer" />
              </motion.div>
            </div>
            <LuSparkles className="absolute -right-2 top-2 text-primary/10 rotate-12" size={80} />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {cart.count === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-[70vh] flex flex-col justify-center items-center px-4"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
                />
                <div className="w-32 h-32 bg-white rounded-[2.5rem] border-2 border-primary/10 shadow-2xl flex items-center justify-center relative z-10">
                  <FaBagShopping className="text-primary" size={50} />
                </div>
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter text-gray-900 mb-4 text-center">Your Vault is Empty</h2>
              <p className="text-gray-500 mb-10 max-w-md text-center text-lg leading-relaxed">Discover our exclusive luxury collection and start building your premium heritage today.</p>
              <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all group" asChild>
                <Link href={WEBSITE_SHOP} className="flex items-center gap-3">
                  Explore Shop <FaArrowRightLong className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="flex lg:flex-nowrap flex-wrap gap-12 my-20 lg:px-32 px-4 max-w-[1920px] mx-auto">
                <div className="lg:w-[68%] w-full">
                  <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">Your Shopping Cart <span className="text-primary/40 ml-2">({cart.count})</span></h1>
                    <Link href={WEBSITE_SHOP} className="text-sm font-black uppercase tracking-widest text-primary hover:text-gray-900 transition-colors border-b-2 border-primary/20">Keep Shopping</Link>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <AnimatePresence initial={false}>
                      {cart.products.map((item) => (
                        <motion.div
                          key={item.variantId}
                          variants={itemVariants}
                          layout
                          className="group relative bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 flex flex-wrap md:flex-nowrap items-center gap-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                        >
                          <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-gray-100 bg-white flex-shrink-0 perspective-1000">
                            <motion.div
                              whileHover={{ scale: 1.1, rotateY: 5, rotateX: -5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="relative w-full h-full"
                            >
                              <Image
                                src={item.media || imgPlaceholder.src}
                                fill
                                className="object-cover"
                                alt={item.name}
                              />
                            </motion.div>
                            {/* Infinity Layer: Scarcity Micro-copy */}
                            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1">
                              <FaBolt className="text-yellow-400" size={8} />
                              <span className="text-[8px] font-black text-white uppercase tracking-widest">High Demand</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-[200px]">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter hover:text-primary transition-colors">
                                <Link href={WEBSITE_PRODUCT_DETAILS(item.url)}>
                                  {item.name}
                                </Link>
                              </h4>
                              <button
                                onClick={() => dispatch(removeFromCart({ productId: item.productId, variantId: item.variantId }))}
                                className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                title="Remove Item"
                              >
                                <LuTrash2 size={22} />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6">
                              <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold uppercase text-gray-500 border border-gray-100">Color: {item.color}</span>
                              <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold uppercase text-gray-500 border border-gray-100">Size: {item.size}</span>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                                  onClick={() => dispatch(decreaseQuantity({ productId: item.productId, variantId: item.variantId }))}
                                >
                                  <HiMinus />
                                </motion.button>
                                <input
                                  type="text"
                                  value={item.qty}
                                  className="w-10 text-center font-black text-gray-900 border-none bg-transparent"
                                  readOnly
                                />
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                                  onClick={() => dispatch(increaseQuantity({ productId: item.productId, variantId: item.variantId }))}
                                >
                                  <HiPlus />
                                </motion.button>
                              </div>

                              <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total</p>
                                <p className="text-xl font-black text-primary">
                                  {(item.sellingPrice * item.qty).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <LuSparkles className="text-primary/20" size={30} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <div className="lg:w-[32%] w-full lg:sticky lg:top-24 h-fit">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 flex items-center gap-3">
                      Order Summary <div className="h-0.5 flex-1 bg-white/10" />
                    </h2>

                    <div className="space-y-6 mb-10">
                      <div className="flex justify-between items-center text-white/60">
                        <span className="font-bold uppercase text-xs tracking-widest">Bag Subtotal</span>
                        <span className="font-black text-white">
                          {subTotal.toLocaleString('en-In', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-white/60">
                        <span className="font-bold uppercase text-xs tracking-widest">Heritage Discount</span>
                        <span className="font-black text-red-400">
                          -{discount.toLocaleString('en-In', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-white/60">
                        <span className="font-bold uppercase text-xs tracking-widest">Estimated Shipping</span>
                        <span className="font-black text-green-400 uppercase text-[10px] tracking-widest">
                          {subTotal >= FREE_SHIPPING_THRESHOLD ? "Complimentary" : "₹149"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 mb-10">
                      <div className="flex justify-between items-end">
                        <div className="w-full">
                          <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-2 text-center lg:text-left">Total Amount</p>
                          <p className="text-4xl font-black tracking-tight text-center lg:text-left">
                            {(subTotal + (subTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 149)).toLocaleString('en-In', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild className="w-full h-16 bg-primary text-white hover:bg-white hover:text-gray-900 rounded-2xl font-black uppercase tracking-widest text-lg transition-all duration-500 shadow-xl group">
                        <Link href={WEBSITE_CHECKOUT} className="flex items-center justify-center gap-3">
                          Begin Checkout
                          <FaArrowRightLong className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </Button>
                    </motion.div>

                    {/* Infinity Layer: Animated Trust Shields */}
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                      <div className="flex items-center gap-4 text-white/40">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                          <LuShieldCheck className="text-green-500" /> Insured Delivery
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                          <LuSparkles className="text-primary" /> Premium Quality
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <p className="text-center mt-8">
                    <Link href={WEBSITE_SHOP} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                      Continue Luxury Shopping
                    </Link>
                  </p>
                </div>
              </div>

            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;
