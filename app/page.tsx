"use client";

import { useState, useEffect, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import AnatomySection from "@/components/AnatomySection";
import SonicGallery from "@/components/SonicGallery";
import BespokeAtelier from "@/components/BespokeAtelier";
import PerformanceSection from "@/components/PerformanceSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Prevent scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  // Loading simulation for 3D/Assets if not fully managed by sub-components
  useEffect(() => {
    // Artificial progress for the demo if real loading finishes fast
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoading(false);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // 2 seconds total load
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-vant-black min-h-screen text-white selection:bg-vant-accent selection:text-white">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen progress={loadingProgress} />}
      </AnimatePresence>

      <Navbar />

      {/* SECTION 1: HERO & SCROLL SEQUENCE */}
      <HeroSection />

      {/* SECTION 2: THE VOICE (Audio Visualizer) */}
      <SonicGallery />

      {/* SECTION 3: ANATOMY (3D) */}
      <AnatomySection />

      {/* SECTION 4: BESPOKE ATELIER (Materials) */}
      <BespokeAtelier />

      {/* SECTION 5: PERFORMANCE DATA */}
      <PerformanceSection />

      {/* SECTION 4: FOOTER */}
      <FooterSection />
    </main>
  );
}


