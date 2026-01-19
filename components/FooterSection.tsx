"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const socialLinks = [
    { name: "INSTAGRAM", color: "#E1306C" },
    { name: "YOUTUBE", color: "#FF0000" },
    { name: "TWITTER", color: "#1DA1F2" },
    { name: "LINKEDIN", color: "#0077B5" },
];

export default function FooterSection() {
    const [hoverColor, setHoverColor] = useState<string | null>(null);

    return (
        <section className="relative w-full bg-vant-black overflow-hidden py-24 px-6 md:px-12 transition-colors duration-700"
            style={{ backgroundColor: hoverColor ? `${hoverColor}10` : '#050505' }}
        >
            {/* Background Morph Element */}
            <div
                className="absolute inset-0 opacity-20 transition-all duration-700 pointer-events-none"
                style={{
                    background: hoverColor
                        ? `radial-gradient(circle at 50% 100%, ${hoverColor}, transparent 70%)`
                        : 'none'
                }}
            />

            <div className="max-w-7xl w-full mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    {/* Newsletter / Inner Circle */}
                    <div>
                        <h3 className="text-white text-xl tracking-widest mb-6 font-bold">THE INNER CIRCLE</h3>
                        <p className="text-gray-500 mb-6 max-w-sm text-sm">
                            Join the waitlist for exclusive drops, private viewings, and engineering deep dives.
                        </p>
                        <form className="flex gap-4 max-w-md">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="bg-transparent border-b border-white/20 py-2 w-full text-white placeholder-gray-600 focus:outline-none focus:border-vant-accent transition-colors"
                            />
                            <button className="text-white font-bold tracking-widest text-sm hover:text-vant-accent transition-colors">
                                JOIN
                            </button>
                        </form>
                    </div>

                    {/* Quick Access Links */}
                    <div className="grid grid-cols-2 gap-8 text-sm">
                        <div>
                            <h4 className="text-gray-500 uppercase tracking-widest mb-4 text-xs">The Brand</h4>
                            <ul className="space-y-3 text-white/60">
                                <li className="hover:text-white cursor-pointer transition-colors">Our Heritage</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Engineering</li>
                                <li className="hover:text-white cursor-pointer transition-colors">The Atelier</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-gray-500 uppercase tracking-widest mb-4 text-xs">Assistance</h4>
                            <ul className="space-y-3 text-white/60">
                                <li className="hover:text-white cursor-pointer transition-colors">Concierge</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Warranty Protocol</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Find a Dealer</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Recall Info</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                    {/* Big Staggered Social Links */}
                    <div className="flex flex-col gap-2">
                        {socialLinks.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href="#"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="text-5xl md:text-8xl font-bold text-white/20 hover:text-white transition-colors duration-300 tracking-tighter cursor-pointer"
                                data-cursor="hover"
                                onMouseEnter={() => setHoverColor(link.color)}
                                onMouseLeave={() => setHoverColor(null)}
                            >
                                {link.name}
                            </motion.a>
                        ))}
                    </div>

                    {/* Final Config CTA */}
                    <div className="mt-12 md:mt-0 text-right">
                        <button className="px-12 py-4 bg-vant-accent text-white font-bold tracking-[0.2em] text-lg hover:bg-white hover:text-black transition-all duration-300" data-cursor="hover">
                            CONFIGURE YOURS
                        </button>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between text-xs text-gray-500 uppercase tracking-widest gap-4">
                    <p>© 2026 VANTIQ AUTOMOTIVE</p>
                    <div className="flex flex-wrap gap-8">
                        <span className="cursor-pointer hover:text-white transition-colors">Terms of Engagement</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Privacy Code</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Cookie Policy</span>
                    </div>
                </div>
            </div>
        </section>
    );
}


