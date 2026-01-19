"use client";

import { useMotionValue, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ZondaScrollCanvasProps {
    scrollYProgress: MotionValue<number>;
    totalFrames: number; // e.g., 160
    imageFolderPath: string; // e.g., "/scroll-animation"
    onProgress?: (progress: number) => void;
    onLoadComplete?: () => void;
}

export default function ZondaScrollCanvas({
    scrollYProgress,
    totalFrames,
    imageFolderPath,
    onProgress,
    onLoadComplete,
}: ZondaScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // 1. Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 1; i <= totalFrames; i++) {
            // Assuming filenames are 1.jpg, 2.jpg... or padded? 
            // User said "1.jpg to 160.jpg". 
            // If they are padded (001.jpg), we need to adjust.
            // Checking file listing from previous step: "ezgif-frame-001.jpg"
            // WAIT. The file listing showed "ezgif-frame-001.jpg".
            // The user prompt said: "1.jpg to 160.jpg".
            // BUT the file listing showed `ezgif-frame-001.jpg`.
            // I MUST USE THE ACTUAL FILENAMES.
            // Pattern seems to be `ezgif-frame-XXX.jpg`.

            const img = new Image();
            // Format index with leading zeros (3 digits)
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

    // 2. Render Loop & Resize Handling
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateDimensions = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const dpr = window.devicePixelRatio || 1;
                const rect = parent.getBoundingClientRect();
                // Set actual canvas size (accounting for DPR)
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                // Ensure CSS size matches parent
                canvas.style.width = "100%";
                canvas.style.height = "100%";
            }
        };

        // Initial sizing
        updateDimensions();

        const render = () => {
            const progress = scrollYProgress.get();
            const frameIndex = Math.min(
                totalFrames - 1,
                Math.floor(progress * totalFrames)
            );

            const img = images[frameIndex];
            // If image is missing, just request next frame to keep loop alive
            if (!img) {
                requestAnimationFrame(render);
                return;
            }

            // If dimensions are invalid, skip draw
            if (canvas.width === 0 || canvas.height === 0) {
                requestAnimationFrame(render);
                return;
            }

            const dpr = window.devicePixelRatio || 1;
            const targetWidth = canvas.width / dpr;
            const targetHeight = canvas.height / dpr;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

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

            ctx.clearRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

            requestAnimationFrame(render);
        };

        const requestId = requestAnimationFrame(render);

        // Debounced Resize Listener
        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateDimensions();
            }, 200);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(requestId);
            clearTimeout(resizeTimer);
        };
    }, [imagesLoaded, scrollYProgress, images, totalFrames]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain z-0"
        />
    );
}
