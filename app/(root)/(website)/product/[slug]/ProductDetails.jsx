"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { IoStar } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { decode, encode } from "entities";
import { HiMinus } from "react-icons/hi2";
import { HiPlus } from "react-icons/hi2";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import loadingSvg from "@/public/assets/images/loading.svg";
import ProductReview from "@/components/Application/website/ProductReview";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaFacebookF,
  FaXTwitter,
  FaRegCopy,
  FaTruckFast,
  FaShield,
  FaArrowRotateLeft,
  FaFireFlameCurved,
  FaBolt,
  FaShareNodes,
} from "react-icons/fa6";
import { LuRuler, LuBox, LuShieldCheck, LuSparkles, LuHistory } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProductDetails = ({
  product,
  variant,
  colors,
  sizes,
  reviewCount,
  averageRating,
  ratingDistribution,
}) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((store) => store.cartStore);

  const [activeThumb, setActiveThumb] = useState();
  const [qty, setQty] = useState(1);
  const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, show: false });
  const [showNotification, setShowNotification] = useState(null);

  // Universe Logic: Simulated Social Proof
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "London", "New York", "Paris"];
  const names = ["Aaryan", "Deepika", "Aditya", "Sarah", "Michael", "Elena", "Vikram"];

  useEffect(() => {
    const triggerNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      setShowNotification({ name: randomName, city: randomCity });

      setTimeout(() => setShowNotification(null), 5000);
    };

    const interval = setInterval(triggerNotification, 20000);
    return () => clearInterval(interval);
  }, []);

  const [stockLeft] = useState(Math.floor(Math.random() * 8) + 3);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.pageXOffset) / width) * 100;
    const y = ((e.pageY - top - window.pageYOffset) / height) * 100;
    setMagnifierPos({ x, y, show: true });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  useEffect(() => {
    setActiveThumb(variant?.media[0]?.secure_url);
  }, [variant]);

  useEffect(() => {
    if (cartStore.count > 0) {
      const existingProduct = cartStore.products.findIndex(
        (cartProduct) =>
          cartProduct.productId === product._id &&
          cartProduct.variantId === variant._id,
      );

      if (existingProduct >= 0) {
        setIsAddedIntoCart(true);
      } else {
        setIsAddedIntoCart(false);
      }
    }
    setIsProductLoading(false);
  }, [variant]);

  const handleThumb = (thumbUrl) => {
    setActiveThumb(thumbUrl);
  };

  const handleQty = (actionType) => {
    if (actionType === "inc") {
      setQty((prev) => prev + 1);
    } else {
      if (qty !== 1) {
        setQty((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      size: variant.size,
      color: variant.color,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      media: variant.media[0]?.secure_url,
      qty: qty,
    };
    dispatch(addIntoCart(cartProduct));
    setIsAddedIntoCart(true);
    showToast("success", "Product Added Into Cart.");
  };

  return (
    <div className="relative min-h-screen">
      {/* Universe Layer: Atmospheric Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-100 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 lg:px-32 px-4">
        {isProductLoading && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
            <Image src={loadingSvg} width={80} height={80} alt="loading" />
          </div>
        )}

        <div className="my-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={WEBSITE_SHOP}>Product</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>
                    {product?.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:flex justify-between items-start lg:gap-16 gap-8 mb-20"
        >
          <motion.div variants={itemVariants} className="md:w-1/2 xl:flex xl:gap-6 md:sticky md:top-24">
            <div className="flex xl:flex-col items-center xl:gap-4 gap-3 xl:w-24 order-first overflow-auto xl:pb-0 pb-4 no-scrollbar max-h-[600px]">
              {variant?.media?.map((thumb) => (
                <motion.div
                  key={thumb._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex-shrink-0 w-20 h-20 xl:w-full xl:h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${thumb.secure_url === activeThumb ? "ring-2 ring-primary ring-offset-2" : "border"}`}
                  onClick={() => handleThumb(thumb.secure_url)}
                >
                  <Image
                    src={thumb?.secure_url || imgPlaceholder.src}
                    fill
                    alt="product thumbnail"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>

            <div
              className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-white border shadow-sm group cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMagnifierPos({ ...magnifierPos, show: false })}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeThumb}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeThumb || imgPlaceholder.src}
                    fill
                    alt="product"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Glassmorphism Magnifier Overlay */}
                  {magnifierPos.show && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 pointer-events-none z-10 hidden md:block"
                      style={{
                        backgroundImage: `url(${activeThumb || imgPlaceholder.src})`,
                        backgroundPosition: `${magnifierPos.x}% ${magnifierPos.y}%`,
                        backgroundSize: "200%",
                        borderRadius: "1.5rem",
                      }}
                    >
                      <div className="absolute inset-0 border-4 border-white/30 backdrop-blur-[1px] shadow-inner" />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <FaBolt className="text-yellow-300" /> High Demand
                </div>
                <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <FaFireFlameCurved className="text-orange-400" /> {Math.floor(Math.random() * 40) + 10} views today
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:w-1/2 md:mt-0 mt-8">
            <motion.div variants={itemVariants}>
              <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Premium Collection</span>
              <h1 className="text-4xl font-extrabold mb-3 text-gray-900 leading-tight">{product.name}</h1>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IoStar key={i} size={18} fill={i < Math.floor(averageRating) ? "currentColor" : "none"} className={i < Math.floor(averageRating) ? "" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer">
                {reviewCount} Verified Reviews
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-black text-primary">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(Number(variant?.sellingPrice || 0))}
              </span>
              <span className="text-xl line-through text-gray-400 mb-1">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(Number(variant?.mrp || 0))}
              </span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-red-500 rounded-lg px-3 py-1 text-white font-bold text-sm mb-1 ml-2"
              >
                -{variant?.discountPercentages}% OFF
              </motion.span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-gray-600 leading-relaxed mb-8 text-lg"
              dangerouslySetInnerHTML={{ __html: decode(product.description).substring(0, 200) + "..." }}
            ></motion.div>

            {/* Color Swatches */}
            <motion.div variants={itemVariants} className="mb-8">
              <p className="mb-3 text-sm font-bold text-gray-900 uppercase tracking-wider flex justify-between">
                <span>Color: <span className="font-normal text-gray-500 uppercase ml-1">{variant?.color}</span></span>
              </p>
              <div className="flex gap-4 flex-wrap">
                {colors.map((color) => (
                  <Link
                    onClick={() => setIsProductLoading(true)}
                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${color}&size=${variant.size}`}
                    key={color}
                    className={`group relative w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${color === variant.color ? "border-primary scale-110 shadow-lg" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <span
                      className="w-9 h-9 rounded-full shadow-inner border border-black/5"
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></span>
                    {color === variant.color && (
                      <motion.span layoutId="activeColor" className="absolute -inset-1 rounded-full border-2 border-primary" />
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Selected Size: <span className="font-normal text-gray-500 ml-1">{variant?.size}</span>
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-xs font-black text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-all flex items-center gap-1.5 uppercase tracking-tighter">
                      <LuRuler size={14} /> Size Guide
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-3xl overflow-hidden border-none p-0 bg-white">
                    <div className="p-8">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black uppercase flex items-center gap-3">
                          <LuRuler className="text-primary" /> Global Size Chart
                        </DialogTitle>
                      </DialogHeader>

                      <div className="overflow-x-auto rounded-2xl border border-gray-100 mb-8">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-tight">
                            <tr>
                              <th className="px-6 py-4">Size</th>
                              <th className="px-6 py-4">Chest (in)</th>
                              <th className="px-6 py-4">Waist (in)</th>
                              <th className="px-6 py-4">Sleeve (in)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {["S", "M", "L", "XL", "XXL"].map((s) => (
                              <tr key={s} className={s === variant.size ? "bg-primary/5 font-bold text-primary" : "text-gray-600"}>
                                <td className="px-6 py-4 uppercase">{s}</td>
                                <td className="px-6 py-4">{36 + ["S", "M", "L", "XL", "XXL"].indexOf(s) * 2}</td>
                                <td className="px-6 py-4">{30 + ["S", "M", "L", "XL", "XXL"].indexOf(s) * 2}</td>
                                <td className="px-6 py-4">32</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-primary/5 p-6 rounded-2xl flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                          <LuSparkles size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Unsure about your size?</h4>
                          <p className="text-sm text-gray-600">Our sizes are true to standard international fitting. If you prefer a loose fit, we recommend ordering one size up.</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-3 flex-wrap">
                {sizes?.map((size) => (
                  <Link
                    onClick={() => setIsProductLoading(true)}
                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${variant.color}&size=${size}`}
                    key={size}
                    className={`min-w-[50px] h-12 flex items-center justify-center rounded-xl font-bold transition-all duration-300 border-2 ${size === variant.size ? "bg-primary border-primary text-white shadow-md scale-105" : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"}`}
                  >
                    {size}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* FOMO: Stock Progress Bar */}
            <motion.div variants={itemVariants} className="mb-8 p-6 rounded-3xl bg-red-50/50 border border-red-100 relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-red-600 font-black text-sm uppercase tracking-tighter flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 rounded-full bg-red-600"
                  />
                  Hurry! Only {stockLeft} items left in stock
                </h4>
                <span className="text-red-400 text-xs font-bold font-mono uppercase">Highly Volatile</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stockLeft / 15) * 100}%` }}
                  className="h-full bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                />
              </div>
              <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                <FaBolt size={80} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mb-10">
              <div className="flex items-center bg-gray-50 h-14 rounded-2xl px-2 border border-gray-200">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  type="button"
                  className="w-12 h-10 flex justify-center items-center text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  onClick={() => handleQty("desc")}
                >
                  <HiMinus size={20} />
                </motion.button>
                <input
                  type="text"
                  value={qty}
                  className="w-12 text-center bg-transparent font-bold border-none outline-none text-lg"
                  readOnly
                />
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  type="button"
                  className="w-12 h-10 flex justify-center items-center text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  onClick={() => handleQty("inc")}
                >
                  <HiPlus size={20} />
                </motion.button>
              </div>

              <div className="flex-1 flex gap-3">
                {!isAddedIntoCart ? (
                  <ButtonLoading
                    type="button"
                    text="Add To Cart"
                    className="flex-1 rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20 transition-all duration-300"
                    onClick={handleAddToCart}
                  />
                ) : (
                  <Button
                    className="flex-1 rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20 transition-all duration-300"
                    type="button"
                    asChild
                  >
                    <Link href={WEBSITE_CART}>View In Cart</Link>
                  </Button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-700 shadow-sm hover:border-primary hover:text-primary transition-all duration-300"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showToast("success", "Link copied to clipboard!");
                    }
                  }}
                  title="Share this product"
                >
                  <FaShareNodes size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* Social Share & Trust Badges */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-gray-100 grid md:grid-cols-3 grid-cols-1 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FaTruckFast size={18} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-900 uppercase">Free Delivery</p>
                  <p className="text-gray-500">Orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <FaShield size={18} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-900 uppercase">Secure Payment</p>
                  <p className="text-gray-500">100% Encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <FaArrowRotateLeft size={18} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-900 uppercase">Easy Returns</p>
                  <p className="text-gray-500">10 Days Window</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Universe Layer: Feature Breakdown Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-4 gap-8 mb-24 mt-20"
        >
          {[
            { icon: <LuBox />, title: "Premium Origin", desc: "Sourced from the finest sustainable materials." },
            { icon: <LuShieldCheck />, title: "Lifetime Quality", desc: "Built to last through every journey." },
            { icon: <LuSparkles />, title: "Handcrafted", desc: "Meticulously finished by master artisans." },
            { icon: <LuHistory />, title: "Heritage Design", desc: "A timeless aesthetic for the modern world." },
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-[2rem] bg-white/50 backdrop-blur-md border border-white hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                {React.cloneElement(item.icon, { size: 28 })}
              </div>
              <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Universe Layer: Complete the Look (Infinite Scrolling refined) */}
        <div className="mb-24 overflow-hidden py-10 relative">
          <div className="flex items-center justify-between mb-8 px-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Complete The Look</h3>
            <Link href={WEBSITE_SHOP} className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all">Explore All</Link>
          </div>

          <div className="relative">
            {/* Soft edge masking for luxury feel */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-8 w-max px-32"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 50,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-[180px] md:w-[220px] group/card flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white mb-4 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10">
                    <Image
                      src={variant?.media[i % variant?.media?.length]?.secure_url || imgPlaceholder.src}
                      fill
                      className="object-cover group-hover/card:scale-110 transition-transform duration-1000"
                      alt={`Related Item ${i}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 opacity-0 group-hover/card:opacity-100">
                      <Button size="sm" className="w-full rounded-xl bg-white/90 backdrop-blur-md text-gray-900 border-none hover:bg-white text-[10px] font-black uppercase tracking-widest shadow-xl py-5">
                        Quick view
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-black text-gray-900 uppercase tracking-tighter text-[11px] mb-1 truncate px-2 text-center opacity-70 group-hover/card:opacity-100 transition-opacity">Luxury Essential {(i % 12) + 1}</h4>
                  <p className="text-primary font-black text-center text-xs">₹{3499 + ((i % 12) * 250)}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Tabs System */}
        <div className="mb-20">
          <div className="flex border-b border-gray-200 overflow-auto no-scrollbar md:justify-center mb-10">
            {["description", "reviews", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-bold uppercase tracking-widest relative transition-colors duration-300 ${activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="prose prose-purple max-w-none prose-lg text-gray-600 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: encode(product.description) }} />
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProductReview
                  productId={product?._id}
                  averageRating={averageRating}
                  reviewCount={reviewCount}
                  ratingDistribution={ratingDistribution}
                />
              </motion.div>
            )}

            {activeTab === "shipping" && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-10 items-center">
                  <div className="md:w-1/3">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                      <FaTruckFast size={40} />
                    </div>
                    <h4 className="text-center font-bold text-gray-900">Global Shipping</h4>
                  </div>
                  <div className="md:w-2/3 space-y-4 text-gray-600">
                    <p className="font-medium text-lg text-gray-900">Your order is in good hands.</p>
                    <p>We provide tracked shipping to over 200 countries. Our average delivery time is 3-5 business days for domestic orders and 7-12 days for international shipping.</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 text-sm font-bold uppercase">
                      <div className="flex items-center gap-2 text-primary">
                        <div className="w-2 h-2 rounded-full bg-primary" /> Free Packaging
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <div className="w-2 h-2 rounded-full bg-primary" /> Live Tracking
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-[100] px-4 py-4 md:px-32 flex items-center justify-between gap-6"
            >
              <div className="hidden md:flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border">
                  <Image src={activeThumb || imgPlaceholder.src} fill className="object-cover" alt="thumb" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{product.name}</h4>
                  <p className="text-primary font-black text-lg">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(Number(variant?.sellingPrice || 0))}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex gap-4">
                <div className="flex items-center bg-gray-100 rounded-xl px-2">
                  <button onClick={() => handleQty("desc")} className="p-2">
                    <HiMinus />
                  </button>
                  <span className="w-8 text-center font-bold">{qty}</span>
                  <button onClick={() => handleQty("inc")} className="p-2">
                    <HiPlus />
                  </button>
                </div>
                {!isAddedIntoCart ? (
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-14 rounded-xl text-lg font-black shadow-lg shadow-primary/20"
                  >
                    ADD TO CART
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="flex-1 h-14 rounded-xl text-lg font-black shadow-lg shadow-primary/20"
                  >
                    <Link href={WEBSITE_CART}>CHECKOUT NOW</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Universe Layer: Real-time Social Proof Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="fixed bottom-28 md:bottom-24 left-4 md:left-6 z-[110] bg-white/90 backdrop-blur-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 md:p-5 rounded-[2rem] flex items-center gap-4 md:gap-5 max-w-[calc(100%-2rem)] md:max-w-sm"
            >
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-inner">
                <Image src={activeThumb || imgPlaceholder.src} fill className="object-cover" alt="thumb" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest">Recent Purchase</p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {showNotification.name} from {showNotification.city}
                </p>
                <p className="text-xs text-gray-500">just ordered a {product.name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductDetails;
