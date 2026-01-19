"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import ScrollCanvas from "@/components/ScrollCanvas";
import StoryOverlay from "@/components/StoryOverlay";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Parallax Typography
    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);

    return (
        <section ref={containerRef} className="h-[500vh] relative bg-vant-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* PROGRESSIVE SCRUBBER */}
                <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 h-64 w-[2px] bg-white/10 z-40 hidden md:block">
                    <motion.div
                        className="w-full bg-vant-accent shadow-[0_0_10px_#C4001A]"
                        style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                    />
                </div>

                {/* FLOATING TECHNICAL TYPOGRAPHY (Parallax) */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-overlay opacity-30">
                    <motion.div style={{ y: parallaxY }} className="absolute top-20 left-10 text-xs font-mono text-white">
                        COORD: 34.0522° N, 118.2437° W<br />
                        ELEV: 285FT<br />
                        SYS: ONLINE
                    </motion.div>
                    <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -400]) }} className="absolute bottom-40 right-20 text-xs font-mono text-white text-right">
                        CHASSIS: C-X75<br />
                        MAT: CARBON-TI<br />
                        AERO: ACTIVE
                    </motion.div>
                </div>

                {/* 3D Sequence Canvas */}
                <ScrollCanvas
                    scrollYProgress={scrollYProgress}
                    totalFrames={160}
                    imageFolderPath="/scroll-animation"
                    onProgress={setLoadingProgress}
                    onLoadComplete={() => setIsLoading(false)}
                />

                {/* Story Overlay (Text) */}
                <StoryOverlay scrollYProgress={scrollYProgress} />
            </div>
        </section>
    );
}
