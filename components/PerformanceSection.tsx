"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const BentoCard = ({ children, className, title, subtitle }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`relative overflow-hidden bg-vant-dark border border-white/5 p-6 md:p-8 flex flex-col justify-between group ${className}`}
    >
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
            <h3 className="text-gray-400 text-sm tracking-widest uppercase mb-2">{subtitle}</h3>
            {children}
            <h4 className="text-xl md:text-2xl font-bold text-white mt-4">{title}</h4>
        </div>
    </motion.div>
);

const Counter = ({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) => {
    const [count, setCount] = useState(from);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = from;
            const end = to;
            const range = end - start;
            const startTime = Date.now();

            const timer = setInterval(() => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / (duration * 1000), 1);

                // Ease out quart
                const ease = 1 - Math.pow(1 - progress, 4);

                setCount(start + range * ease);

                if (progress === 1) clearInterval(timer);
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, from, to, duration]);

    return <span ref={ref}>{count.toFixed(1)}</span>;
};

export default function PerformanceSection() {
    return (
        <section className="min-h-screen bg-vant-black relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mb-16"
                >
                    <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">RAW DATA</h2>
                    <div className="w-full h-px bg-white/10" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[800px]">
                    {/* Main Speed Stat - Tall Left */}
                    <BentoCard className="md:col-span-1 md:row-span-2 bg-vant-accent/10 md:h-[800px]" subtitle="ACCELERATION" title="0-60 MPH">
                        <div className="text-8xl font-bold text-vant-accent my-auto">
                            <Counter from={0} to={2.5} />s
                        </div>
                        <div className="w-full h-32 mt-8 opacity-50">
                            {/* Simple SVG Graph */}
                            <svg viewBox="0 0 100 50" className="w-full h-full stroke-white/50 fill-none" strokeWidth="2">
                                <motion.path
                                    d="M0 50 Q 50 50 100 0"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                        </div>
                    </BentoCard>

                    {/* Top Right Wide - Speedometer visual */}
                    <BentoCard className="md:col-span-2 md:row-span-1" subtitle="TOP SPEED" title="MPH">
                        <div className="flex items-baseline gap-4">
                            <div className="text-9xl font-bold text-white">
                                <Counter from={0} to={217} duration={3} />
                            </div>
                            <div className="text-white/20 text-6xl font-mono">
                                350 KM/H
                            </div>
                        </div>
                    </BentoCard>

                    {/* Bottom Right Split 1 */}
                    <BentoCard className="md:col-span-1 md:row-span-1" subtitle="RANGE" title="ELECTRIC">
                        <div className="text-6xl font-bold text-white">
                            <Counter from={0} to={450} /> <span className="text-2xl text-gray-500">MI</span>
                        </div>
                    </BentoCard>

                    {/* Bottom Right Split 2 */}
                    <BentoCard className="md:col-span-1 md:row-span-1" subtitle="TOTAL POWER" title="HORSEPOWER">
                        <div className="text-6xl font-bold text-white">
                            <Counter from={0} to={1200} duration={2.5} /> <span className="text-2xl text-vant-accent">HP</span>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </section>
    );
}
