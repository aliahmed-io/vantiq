"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SonicGallery() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // State for audio nodes (multiple oscillators for richness)
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const gainNodeRef = useRef<GainNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [rpm, setRpm] = useState(0); // 0 to 1
    const animationFrameRef = useRef<number | null>(null);

    const startEngine = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioCtxRef.current;
        if (!ctx) return;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.2; // Base volume

        // Analyser
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;

        masterGain.connect(analyser);
        analyser.connect(ctx.destination);

        // V12 Synthesis: Multiple oscillators for thickness
        const oscConfigs = [
            { type: "sawtooth", detune: 0, freqScale: 1 },    // Fundamental
            { type: "sawtooth", detune: 15, freqScale: 1 },   // Detuned slightly
            { type: "sawtooth", detune: -15, freqScale: 1 },  // Detuned slightly
            { type: "square", detune: 0, freqScale: 0.5 },    // Sub-harmonics (Bass)
            { type: "triangle", detune: 5, freqScale: 2 },    // Overtones
        ];

        const activeOscs: OscillatorNode[] = [];
        const baseFreq = 60; // Lower idle rumble (was 80)

        oscConfigs.forEach(cfg => {
            const osc = ctx.createOscillator();
            osc.type = cfg.type as OscillatorType;
            osc.frequency.setValueAtTime(baseFreq * cfg.freqScale, ctx.currentTime);
            osc.detune.setValueAtTime(cfg.detune, ctx.currentTime);
            osc.connect(masterGain);
            osc.start();
            activeOscs.push(osc);
        });

        oscillatorsRef.current = activeOscs;
        gainNodeRef.current = masterGain;
        analyserRef.current = analyser;
        setIsPlaying(true);

        drawVisualizer();
    };

    const stopEngine = () => {
        oscillatorsRef.current.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) { }
        });
        oscillatorsRef.current = [];

        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
            gainNodeRef.current = null;
        }

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setIsPlaying(false);
        setRpm(0);
    };

    const handleThrottle = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isPlaying) startEngine();
    };

    const updateEngineParams = (newRpm: number) => {
        if (oscillatorsRef.current.length === 0 || !gainNodeRef.current || !audioCtxRef.current) return;

        const now = audioCtxRef.current.currentTime;
        const timeConstant = 0.1;

        // RPM Mapping
        // Idle: 60Hz -> Redline: 400Hz (V12 screamer range, but keeping fundamental lower to avoid "mosquito")
        const startFreq = 60;
        const maxFreq = 400;

        oscillatorsRef.current.forEach((osc, i) => {
            // Re-apply freq scaling logic roughly
            const scale = i === 3 ? 0.5 : (i === 4 ? 2 : 1);
            const targetFreq = (startFreq + ((maxFreq - startFreq) * newRpm)) * scale;
            osc.frequency.setTargetAtTime(targetFreq, now, timeConstant);
        });

        // Volume swelling
        // Idle: 0.2 -> Redline: 0.5
        gainNodeRef.current.gain.setTargetAtTime(0.2 + (newRpm * 0.3), now, timeConstant);
    };

    // Interaction Handlers for "Throttle"
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPlaying) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setRpm(x);
        updateEngineParams(x);
    };

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const analyser = analyserRef.current;
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 1.5; // Scale up

                // Color based on RPM/Intensity
                const r = barHeight + (25 * (i / bufferLength));
                const g = 250 * (i / bufferLength);
                const b = 50;

                ctx.fillStyle = `rgb(${r},${0},${0})`; // Red vibe
                ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                // Reflection/Symmetry
                ctx.fillStyle = `rgba(${r},${0},${0}, 0.2)`;
                ctx.fillRect(x, 0, barWidth, barHeight / 2);

                x += barWidth + 1;
            }
        };

        draw();
    };

    return (
        <section className="h-screen w-full bg-vant-black relative flex flex-col items-center justify-center overflow-hidden">

            {/* Visualizer Canvas */}
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full max-w-4xl h-[400px] z-10 opacity-80 mix-blend-screen"
            />

            {/* UI Overlay */}
            <div className="absolute z-20 text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                    THE VOICE
                </h2>

                {!isPlaying ? (
                    <button
                        onClick={startEngine}
                        className="px-8 py-4 bg-vant-accent text-white font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                        data-cursor="hover"
                    >
                        IGNITION
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <motion.div
                            className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden relative group cursor-crosshair mx-auto"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => { setRpm(0); updateEngineParams(0); }}
                            data-cursor="hover"
                        >
                            <motion.div
                                className="h-full bg-vant-accent"
                                style={{ width: `${rpm * 100}%` }}
                            />
                            <div className="absolute top-4 left-0 w-full text-xs text-gray-500 font-mono text-center mt-2">
                                DRAG TO REV // {(rpm * 9000).toFixed(0)} RPM
                            </div>
                        </motion.div>

                        <button
                            onClick={stopEngine}
                            className="text-xs text-red-500 font-mono tracking-widest hover:text-red-400 border border-red-900/30 px-4 py-2 rounded uppercase"
                            data-cursor="hover"
                        >
                            [ Kill Switch ]
                        </button>
                    </div>
                )}

                <p className="text-gray-500 text-sm tracking-widest mt-4">
                    WARNING: HIGH DECIBEL OUTPUT
                </p>
            </div>

            {/* Shake Effect Wrapper would go here based on RPM */}
        </section>
    );
}
