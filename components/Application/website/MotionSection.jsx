"use client";
import React from "react";
import { motion } from "framer-motion";

const MotionSection = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.section
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.section>
    );
};

export default MotionSection;
