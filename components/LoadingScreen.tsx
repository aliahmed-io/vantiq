"use client";

import { motion } from "framer-motion";

interface LoadingScreenProps {
    progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-100 bg-vant-black flex flex-col items-center justify-center"
        >
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-vant-accent"
                />
            </div>
            <div className="text-vant-accent font-mono text-xl tracking-widest">
                {Math.round(progress)}%
            </div>
        </motion.div>
    );
}
