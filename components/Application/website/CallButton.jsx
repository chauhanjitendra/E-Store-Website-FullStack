"use client";
import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const CallButton = () => {
    const phoneNumber = "+917779096802";
    const callUrl = `tel:${phoneNumber}`;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{
                scale: 1,
                opacity: 1,
                y: [0, -10, 0]
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                scale: { delay: 1, type: "spring", stiffness: 260, damping: 20 }
            }}
            className="fixed bottom-6 left-6 z-[9999]"
        >
            <Link
                href={callUrl}
                title="Call us for support"
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-xl hover:bg-primary/90 transition-colors relative group border-2 border-white/20"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 5
                        }}
                    >
                        <FaPhoneAlt size={24} />
                    </motion.div>

                    {/* Tooltip */}
                    <span className="absolute left-16 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-white/20 -translate-x-2 group-hover:translate-x-0">
                        CALL KAREIN?
                    </span>

                    {/* Enhanced Pulse effect */}
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30 -z-10 scale-125"></span>
                    <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-10 -z-10 scale-150"></span>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default CallButton;
