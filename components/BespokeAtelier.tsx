"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

// In a real app, these would be the generated assets
const materials = [
    {
        id: "carbon",
        name: "FORGED CARBON",
        desc: "Chaotic fiber alignment for maximum structural rigidity.",
        src: "/materials/carbon.png"
    },
    {
        id: "leather",
        name: "ANILINE LEATHER",
        desc: "Hand-stitched, untreated hides preserving natural pores.",
        src: "/materials/leather.png"
    },
    {
        id: "titanium",
        name: "GRADE-5 TITANIUM",
        desc: "Aerospace alloy ensuring lightweight durability.",
        src: "/materials/titanium.png"
    }
];

export default function BespokeAtelier() {
    return (
        <section className="min-h-screen bg-vant-dark py-24 overflow-x-hidden">
            <div className="px-6 md:px-12 mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">BESPOKE ATELIER</h2>
                <div className="w-full h-px bg-white/10" />
                <p className="text-gray-400 mt-4 max-w-xl">
                    Every surface tells a story. From the chaotic weave of forged carbon to the
                    animate warmth of natural leather. Touch the impossible.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12 px-6 md:px-12 w-full max-w-7xl mx-auto">
                {materials.map((mat) => (
                    <MaterialCard key={mat.id} material={mat} />
                ))}
            </div>
        </section>
    );
}

function MaterialCard({ material }: { material: any }) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            className="relative w-full h-[600px] bg-black border border-white/10 group cursor-none overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            data-cursor="view"
        >
            {/* Base Image */}
            <div className="absolute inset-0">
                {/* 
                    Note: In a real deployment, we'd copy these assets to 'public' folder. 
                    For now, we reference the artifact path directly if possible, or use a placeholder if blocked.
                    Using placeholder 'fill' for layout correctness.
                 */}
                <img
                    src={material.src}
                    alt={material.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                />
            </div>

            {/* Loupe Effect */}
            {isHovered && (
                <motion.div
                    className="absolute w-48 h-48 rounded-full border-2 border-white/20 pointer-events-none z-20 shadow-2xl backdrop-contrast-125"
                    style={{
                        top: mousePos.y - 96,
                        left: mousePos.x - 96,
                        backgroundImage: `url(${material.src})`,
                        backgroundSize: '200%', // Magnified
                        backgroundPosition: `${(mousePos.x / 500) * 100}% ${(mousePos.y / 600) * 100}%`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                />
            )}

            <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black to-transparent">
                <h3 className="text-3xl font-bold text-white mb-2">{material.name}</h3>
                <p className="text-gray-400 text-sm">{material.desc}</p>
            </div>
        </div>
    );
}
