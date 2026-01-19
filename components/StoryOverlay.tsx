"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function StoryOverlay({ scrollYProgress }: { scrollYProgress: any }) {
    // 0-15% HERO
    const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

    // 15-40% ENGINEERING
    const engOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
    const engX = useTransform(scrollYProgress, [0.15, 0.2], [-50, 0]);

    // 40-65% POWER
    const powerOpacity = useTransform(scrollYProgress, [0.4, 0.45, 0.6, 0.65], [0, 1, 1, 0]);
    const powerX = useTransform(scrollYProgress, [0.4, 0.45], [50, 0]);

    // 65-85% AERO
    const aeroOpacity = useTransform(scrollYProgress, [0.65, 0.7, 0.8, 0.85], [0, 1, 1, 0]);
    const aeroY = useTransform(scrollYProgress, [0.65, 0.7], [50, 0]);

    // 85-100% FINAL
    const finalOpacity = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 0.99], [0, 1, 1, 0]);
    const finalScale = useTransform(scrollYProgress, [0.85, 0.95], [0.9, 1]);

    return (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center p-6 w-full h-full">

            {/* 0-15% HERO INTRO */}
            <motion.div
                style={{ opacity: heroOpacity, y: heroY }}
                className="absolute text-center max-w-4xl"
            >
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 text-white drop-shadow-2xl">
                    VANTIQ
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 font-light tracking-[0.2em] uppercase">
                    Performance, Refined.
                </p>
            </motion.div>

            {/* 15-40% ENGINEERING REVEAL - LEFT */}
            <motion.div
                style={{ opacity: engOpacity, x: engX }}
                className="absolute left-6 md:left-24 top-1/3 max-w-lg text-left"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                    Engineered <br /> with Intent.
                </h2>
                <div className="h-1 w-24 bg-vant-accent mb-6" />
                <p className="text-lg text-gray-400 leading-relaxed font-light">
                    Every component is designed for balance, rigidity, and control.
                    <br /><span className="text-white font-medium">No excess. No compromise.</span>
                </p>
            </motion.div>

            {/* 40-65% POWER & CONTROL - RIGHT */}
            <motion.div
                style={{ opacity: powerOpacity, x: powerX }}
                className="absolute right-6 md:right-24 top-1/3 max-w-lg text-right"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                    Power You <br /> Can Feel.
                </h2>
                <div className="h-1 w-24 bg-vant-accent mb-6 ml-auto" />
                <ul className="text-lg text-gray-400 leading-normal font-light space-y-2">
                    <li>Performance-tuned powertrain</li>
                    <li>Adaptive suspension geometry</li>
                    <li>Precision-balanced chassis</li>
                </ul>
            </motion.div>

            {/* 65-85% AERO - CENTER BOTTOM */}
            <motion.div
                style={{ opacity: aeroOpacity, y: aeroY }}
                className="absolute bottom-24 md:bottom-32 text-center max-w-2xl"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    Designed by Airflow
                </h2>
                <p className="text-lg text-gray-400">
                    Every curve reduces drag. Every surface serves performance.
                </p>
            </motion.div>

            {/* 85-100% FINAL - CENTER */}
            <motion.div
                style={{ opacity: finalOpacity, scale: finalScale }}
                className="absolute text-center"
            >
                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                    Built to Move You.
                </h2>
                <p className="text-xl text-gray-300 mb-10 tracking-widest uppercase">
                    Performance without distraction.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center pointer-events-auto">
                    <button className="px-8 py-4 bg-vant-accent text-white font-bold tracking-widest hover:bg-vant-highlight transition-all duration-300 rounded-sm">
                        DISCOVER VANTIQ
                    </button>
                    <button className="px-8 py-4 border border-white/20 text-white font-bold tracking-widest hover:bg-white/10 transition-all duration-300 rounded-sm">
                        FULL SPECS
                    </button>
                </div>
            </motion.div>

        </div>
    );
}
