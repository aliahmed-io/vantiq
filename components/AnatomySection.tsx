"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, Html, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Model({ isXRay }: { isXRay: boolean }) {
    const { scene } = useGLTF("/red+sports+car+3d+model.glb");
    const [originalMaterials, setOriginalMaterials] = useState<Map<string, THREE.Material | THREE.Material[]>>(new Map());

    // Initialize: Cache original materials on first load
    useEffect(() => {
        const mats = new Map();
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mats.set(mesh.uuid, mesh.material);
            }
        });
        setOriginalMaterials(mats);
    }, [scene]);

    // Material switching logic
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                if (isXRay) {
                    // Apply X-Ray
                    mesh.material = new THREE.MeshPhysicalMaterial({
                        color: "white",
                        wireframe: true,
                        transparent: true,
                        opacity: 0.1,
                        emissive: "#C4001A", // VANTIQ Red
                        emissiveIntensity: 0.2
                    });
                } else {
                    // Revert to Original
                    const original = originalMaterials.get(mesh.uuid);
                    if (original) {
                        mesh.material = original;
                    }
                }
            }
        });
    }, [isXRay, originalMaterials, scene]);

    return <primitive object={scene} />;
}

function Hotspot({ position, label, onClick }: { position: [number, number, number], label: string, onClick: () => void }) {
    return (
        <Html position={position} style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
            <button
                data-cursor="view"
                onClick={onClick}
                className="group relative flex items-center justify-center w-6 h-6 z-20"
            >
                <div className="absolute inset-0 bg-vant-accent rounded-full opacity-50 animate-ping" />
                <div className="relative w-3 h-3 bg-vant-accent rounded-full border border-white transition-transform group-hover:scale-150" />
                <div className="absolute left-6 ml-2 bg-vant-black/80 backdrop-blur px-3 py-1 rounded border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                </div>
            </button>
        </Html>
    );
}

export default function AnatomySection() {
    const [xrayMode, setXrayMode] = useState(false);

    return (
        <section className="h-screen w-full relative bg-vant-dark overflow-hidden">
            <div className="absolute top-12 left-6 md:left-12 z-10 pointer-events-none">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">ANATOMY</h2>
                <div className="w-24 h-1 bg-vant-accent" />
            </div>

            <div className="absolute bottom-12 right-6 md:right-12 z-10 flex gap-4 pointer-events-auto">
                <button
                    onClick={() => setXrayMode(!xrayMode)}
                    className="px-6 py-3 bg-white/5 backdrop-blur border border-white/10 text-white font-mono text-sm tracking-widest hover:bg-vant-accent transition-colors"
                    data-cursor="hover"
                >
                    {xrayMode ? "DISABLE X-RAY" : "ENABLE X-RAY"}
                </button>
            </div>

            <div className="w-full h-full" data-cursor="drag">
                <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 8] }} gl={{ preserveDrawingBuffer: true }}>
                    <Suspense fallback={null}>
                        <Environment preset="city" />
                        <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                            <Stage environment={null} intensity={1} shadows={false}>
                                <Model isXRay={xrayMode} />
                            </Stage>

                            {/* Hotspots - Approximate positions */}
                            <Hotspot position={[1.5, 0.5, 1]} label="Ceramic Brakes" onClick={() => console.log('Brakes')} />
                            <Hotspot position={[0, 1, 0]} label="V12 Engine" onClick={() => console.log('Engine')} />
                            <Hotspot position={[-0.5, 0.8, 0.5]} label="Cockpit" onClick={() => console.log('Cockpit')} />

                        </PresentationControls>
                        <ContactShadows position={[0, -1.4, 0]} opacity={0.7} scale={10} blur={2.5} far={4} />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
}

