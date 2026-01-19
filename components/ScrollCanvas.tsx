"use client";

import { useMotionValue, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ScrollCanvasProps {
    scrollYProgress: MotionValue<number>;
    totalFrames: number;
    imageFolderPath: string;
    onProgress?: (progress: number) => void;
    onLoadComplete?: () => void;
}

export default function ScrollCanvas({
    scrollYProgress,
    totalFrames,
    imageFolderPath,
    onProgress,
    onLoadComplete,
}: ScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const renderLoopId = useRef<number | null>(null);

    // 1. Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            // filenames: ezgif-frame-001.jpg ... ezgif-frame-160.jpg
            const paddedIndex = i.toString().padStart(3, "0");
            img.src = `${imageFolderPath}/ezgif-frame-${paddedIndex}.jpg`;

            img.onload = () => {
                loadedCount++;
                const percent = (loadedCount / totalFrames) * 100;
                if (onProgress) onProgress(percent);

                if (loadedCount === totalFrames) {
                    setImagesLoaded(true);
                    if (onLoadComplete) onLoadComplete();
                }
            };
            imgArray.push(img);
        }
        setImages(imgArray);
    }, [totalFrames, imageFolderPath, onProgress, onLoadComplete]);

    // 2. Render Loop with Optimized RAF
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded || images.length === 0) return;

        const ctx = canvas.getContext("2d", { alpha: false }); // Optimize for no transparency if possible
        if (!ctx) return;

        // Force background color match immediately
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const updateDimensions = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const dpr = window.devicePixelRatio || 1;
                const rect = parent.getBoundingClientRect();

                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                canvas.style.width = "100%";
                canvas.style.height = "100%";

                // Re-draw immediately after resize
                requestAnimationFrame(render);
            }
        };

        const render = () => {
            const progress = scrollYProgress.get();
            // Map progress 0..1 to frame index 0..(totalFrames-1)
            const frameIndex = Math.min(
                totalFrames - 1,
                Math.floor(progress * totalFrames)
            );

            const img = images[frameIndex];
            if (!img) return;

            const dpr = window.devicePixelRatio || 1;
            const targetWidth = canvas.width / dpr;
            const targetHeight = canvas.height / dpr;

            // Fill background to avoid trails
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            // "Contain" logic
            const imgRatio = img.width / img.height;
            const canvasRatio = targetWidth / targetHeight;

            let renderW, renderH, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                renderH = targetHeight;
                renderW = img.width * (targetHeight / img.height);
                offsetX = (targetWidth - renderW) / 2;
                offsetY = 0;
            } else {
                renderW = targetWidth;
                renderH = img.height * (targetWidth / img.width);
                offsetX = 0;
                offsetY = (targetHeight - renderH) / 2;
            }

            // Draw image
            ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        };

        // Subscribe to scroll changes
        const unsubscribe = scrollYProgress.on("change", () => {
            if (renderLoopId.current === null) {
                renderLoopId.current = requestAnimationFrame(() => {
                    render();
                    renderLoopId.current = null;
                });
            }
        });

        // Initial setup
        updateDimensions();
        render(); // First draw

        const handleResize = () => updateDimensions();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            unsubscribe();
            if (renderLoopId.current) cancelAnimationFrame(renderLoopId.current);
        };
    }, [imagesLoaded, scrollYProgress, images, totalFrames]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
    );
}
