"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const navLinks = [
        { name: "The Lineup", href: "#lineup" }, // Products
        { name: "Engineering", href: "#engineering" }, // Story
        { name: "Concierge", href: "#concierge" }, // Support
        { name: "Your Garage", href: "#garage" }, // Cart/Bag
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: "-100%", opacity: 0 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md bg-vant-glass border-b border-white/5"
        >
            {/* Brand */}
            <div className="flex-1">
                <Link
                    href="/"
                    className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white hover:text-vant-accent transition-colors duration-300"
                >
                    VANTIQ
                </Link>
            </div>

            {/* Center Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-300 tracking-wide font-medium"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Right CTA */}
            <div className="flex-1 flex justify-end gap-6 items-center">
                <Link href="#access" className="text-xs font-bold tracking-widest text-white hover:text-vant-accent transition-colors hidden md:block">
                    ACCESS
                </Link>
                <button className="group relative px-5 py-2 overflow-hidden rounded-full bg-white/10 hover:bg-vant-accent transition-all duration-300 border border-white/10">
                    <span className="relative z-10 text-xs md:text-sm font-bold tracking-widest text-white group-hover:text-white transition-colors">
                        CONFIGURE
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-vant-accent to-vant-highlight opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
            </div>
        </motion.nav>
    );
}


