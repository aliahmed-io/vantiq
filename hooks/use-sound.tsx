"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Placeholder for sound assets - in a real app these would be paths
const SOUNDS = {
    hover: "/sounds/hover.mp3",
    click: "/sounds/click.mp3",
    ambient: "/sounds/engine-idle.mp3",
};

type SoundContextType = {
    playSound: (type: keyof typeof SOUNDS) => void;
    isMuted: boolean;
    toggleMute: () => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction to bypass autoplay policy
        const initAudio = () => {
            if (!audioContext) {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                setAudioContext(ctx);
            }
        };

        window.addEventListener("click", initAudio, { once: true });
        return () => window.removeEventListener("click", initAudio);
    }, [audioContext]);

    const playSound = (type: keyof typeof SOUNDS) => {
        if (isMuted || !audioContext) return;

        // In a real implementation, we would load the buffer and play it here.
        // For now, we just log to console to simulate the hook firing.
        // console.log(`Playing sound: ${type}`);

        // Example logic if we had files:
        // const source = audioContext.createBufferSource();
        // source.buffer = loadedBuffers[type];
        // source.connect(audioContext.destination);
        // source.start();
    };

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <SoundContext.Provider value={{ playSound, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
}
