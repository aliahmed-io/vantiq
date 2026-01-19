"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { carData } from "@/data/carData";

interface ZondaExperienceProps {
    scrollYProgress: MotionValue<number>;
}

export default function ZondaExperience({ scrollYProgress }: ZondaExperienceProps) {
    // --- Hero Phase (0 - 0.33) ---
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);
    const heroPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.3 ? "auto" : "none"));

    // --- Design Phase (0.33 - 0.66) ---
    const designOpacity = useTransform(
        scrollYProgress,
        [0.3, 0.38, 0.58, 0.66],
        [0, 1, 1, 0]
    );
    const designY = useTransform(scrollYProgress, [0.33, 0.38], [50, 0]);

    // --- Engine Phase (0.66 - 1.0) ---
    const engineOpacity = useTransform(
        scrollYProgress,
        [0.63, 0.71, 0.95, 1],
        [0, 1, 1, 1]
    );
    const engineY = useTransform(scrollYProgress, [0.66, 0.71], [50, 0]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
            {/* 1. Hero Section */}
            <motion.div
                style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointerEvents }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
            >
                <h1 className="text-6xl md:text-9xl font-bold tracking-widest bg-clip-text text-transparent bg-linear-to-b from-white to-gray-500 drop-shadow-lg">
                    {carData.hero.title}
                </h1>
                <h2 className="text-2xl md:text-4xl text-vant-accent mt-4 tracking-[0.2em] font-light">
                    {carData.hero.price}
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="mt-12 px-8 py-3 border border-vant-accent text-vant-accent hover:bg-vant-accent hover:text-black transition-all duration-300 tracking-widest text-sm pointer-events-auto"
                >
                    {carData.hero.cta}
                </motion.button>
            </motion.div>

            {/* 2. Design Section */}
            <motion.div
                style={{ opacity: designOpacity, y: designY }}
                className="absolute inset-0 flex flex-col items-start justify-center pl-12 md:pl-24 lg:pl-48"
            >
                <h3 className="text-vant-white text-sm md:text-base tracking-[0.5em] mb-2 uppercase border-l-2 border-vant-accent pl-4">
                    {carData.design.title}
                </h3>
                <h2 className="text-4xl md:text-7xl font-bold max-w-2xl leading-tight">
                    {carData.design.description}
                </h2>
                <p className="mt-6 text-gray-400 max-w-lg text-lg font-light tracking-wide">
                    {carData.design.details}
                </p>
            </motion.div>

            {/* 3. Engine Section (Right aligned) */}
            <motion.div
                style={{ opacity: engineOpacity, y: engineY }}
                className="absolute inset-0 flex flex-col items-end justify-center pr-12 md:pr-24 lg:pr-48 text-right"
            >
                <h3 className="text-vant-white text-sm md:text-base tracking-[0.5em] mb-4 uppercase border-r-2 border-vant-accent pr-4">
                    {carData.engine.title}
                </h3>
                <div className="flex flex-col gap-6">
                    {carData.engine.specs.map((spec, i) => (
                        <div key={i} className="group">
                            <div className="text-gray-500 text-xs tracking-widest uppercase mb-1">
                                {spec.label}
                            </div>
                            <div className="text-3xl md:text-5xl font-mono text-white group-hover:text-vant-accent transition-colors">
                                {spec.value}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Screen Reader Announcements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                <span className={heroOpacity.get() === 1 ? "block" : "hidden"}>{carData.hero.title} {carData.hero.price}</span>
                <span className={designOpacity.get() === 1 ? "block" : "hidden"}>{carData.design.title} {carData.design.description}</span>
                <span className={engineOpacity.get() === 1 ? "block" : "hidden"}>{carData.engine.title} Specs</span>
            </div>
        </div>
    );
}
