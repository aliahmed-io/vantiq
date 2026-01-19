"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorTextRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorText, setCursorText] = useState("");

    useEffect(() => {
        if (!cursorRef.current || !cursorTextRef.current) return;

        const cursor = cursorRef.current;
        const cursorTextEl = cursorTextRef.current;

        // Initial setup
        gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0.5 });

        // Mouse follow logic utilizing gsap.quickTo for performance
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

        const onMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener("mousemove", onMouseMove);

        // Hover Logic
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Link/Button Hover
            if (target.closest("a, button, [data-cursor='hover']")) {
                setIsHovering(true);
                gsap.to(cursor, {
                    scale: 3,
                    backgroundColor: "white",
                    mixBlendMode: "difference",
                    duration: 0.3
                });
                setCursorText("");
            }
            // 3D View Hover
            else if (target.closest("[data-cursor='view']")) {
                setIsHovering(true);
                gsap.to(cursor, {
                    scale: 4,
                    backgroundColor: "#C4001A",
                    mixBlendMode: "normal",
                    duration: 0.3
                });
                setCursorText("VIEW");
                gsap.to(cursorTextEl, { opacity: 1, duration: 0.2 });
            }
            // Drag Hover
            else if (target.closest("[data-cursor='drag']")) {
                setIsHovering(true);
                gsap.to(cursor, {
                    scale: 3,
                    backgroundColor: "white",
                    mixBlendMode: "difference",
                    duration: 0.3
                });
                setCursorText("DRAG");
                gsap.to(cursorTextEl, { opacity: 1, duration: 0.2 });
            }
        };

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("a, button, [data-cursor], [data-cursor='view'], [data-cursor='hover']")) {
                setIsHovering(false);
                setCursorText("");
                gsap.to(cursor, {
                    scale: 0.5,
                    backgroundColor: "white",
                    mixBlendMode: "difference",
                    duration: 0.3
                });
                gsap.to(cursorTextEl, { opacity: 0, duration: 0.2 });
            }
        };

        window.addEventListener("mouseover", onMouseOver);
        window.addEventListener("mouseout", onMouseOut); // Capture phase might be better for 3D

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseover", onMouseOver);
            window.removeEventListener("mouseout", onMouseOut);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-9999 w-8 h-8 bg-white rounded-full pointer-events-none flex items-center justify-center mix-blend-difference"
        >
            <span ref={cursorTextRef} className="text-[5px] font-bold text-white tracking-widest opacity-0">
                {cursorText}
            </span>
        </div>
    );
}

