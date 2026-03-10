"use client";
import Image from "next/image";
import React from "react";
import imagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { motion } from "framer-motion";

const ProductBox = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="rounded-lg border overflow-hidden bg-white transition-all duration-300"
    >
      <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
        <div className="overflow-hidden">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
            <Image
              src={product?.media[0]?.secure_url || imagePlaceholder.src}
              width={400}
              height={400}
              alt={product.media[0]?.alt || product.name}
              title={product.media[0]?.alt || product.name}
              className="w-full lg:h-[300px] md:h-[200px] h-[150px] object-cover object-top"
            />
          </motion.div>
        </div>
        <div className="p-3 border-t">
          <h4 className="font-medium truncate">{product?.name}</h4>
          <p className="flex gap-2 text-sm mt-2 items-center">
            <span className="line-through text-gray-400">
              {Number(product?.mrp).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>

            <span className="font-bold text-primary">
              {Number(product?.sellingPrice).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductBox;
