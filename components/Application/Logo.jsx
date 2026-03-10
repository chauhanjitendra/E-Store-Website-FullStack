"use client";
import React from "react";

const Logo = ({ className = "", variant = "dark" }) => {
    const color = variant === "dark" ? "#000000" : "#FFFFFF";

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="40"
                height="40"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width="100" height="100" rx="20" fill={color} />
                <path
                    d="M30 30H70V40H40V45H65V55H40V60H70V70H30V30Z"
                    fill={variant === "dark" ? "#FFFFFF" : "#000000"}
                />
                <circle cx="80" cy="80" r="10" fill="#EF4444" />
            </svg>
            <span className={`text-2xl font-bold tracking-tight`} style={{ color }}>
                E<span className="text-red-500">-</span>Store
            </span>
        </div>
    );
};

export default Logo;
