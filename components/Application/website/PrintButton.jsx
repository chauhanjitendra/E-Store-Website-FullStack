"use client";

import { Printer } from "lucide-react";

const PrintButton = ({ className = "" }) => {
    return (
        <button
            onClick={() => window.print()}
            className={`flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-300 no-print ${className}`}
        >
            <Printer size={20} />
            <span>Print Order</span>
        </button>
    );
};

export default PrintButton;
