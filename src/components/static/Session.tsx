"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, TrendingUp } from "lucide-react";

// Smooth Cubic Bezier for premium feel
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const AboutSection = () => {
    // Animation settings with increased duration and base delay
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.2 },
        transition: {
            duration: 0.8, // Speed ektu komano hoyechhe (Slow kora hoyechhe)
            ease: EASE_OUT,
            delay: 0.20 // Base delay 0.20s dewa hoyechhe
        },
    };

    return (
        <section className="py-20 bg-white dark:bg-black overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* --- Left Side: Image Gallery & Floating Badge --- */}
                    <div className="relative">
                        {/* 20% OFF Badge - High Delay for Entry */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: -20 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1, delay: 0.6, ease: EASE_OUT }} // Beshi deri kore ashbe
                            className="absolute top-1/2 -translate-y-1/2 -left-10 z-20 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-xl hidden md:flex items-center gap-4"
                        >
                            <div className="bg-orange-500 p-2 rounded-full text-white shadow-lg animate-bounce">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-orange-600 leading-none">20% OFF</p>
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">For All Courses</p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Prothom Image - Base Delay */}
                            <motion.div
                                {...fadeInUp}
                                className="relative overflow-hidden rounded-[40px] shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
                                    alt="Students"
                                    className="h-[450px] w-full object-cover"
                                />
                            </motion.div>

                            <div className="space-y-4">
                                {/* Stats Box - Sequential Delay */}
                                <motion.div
                                    {...fadeInUp}
                                    transition={{ ...fadeInUp.transition, delay: 0.4 }} // 0.20s extra delay
                                    className="bg-blue-600 p-8 rounded-[30px] text-center text-white shadow-lg shadow-blue-200/50"
                                >
                                    <h4 className="text-3xl font-bold">16 +</h4>
                                    <p className="text-xs uppercase tracking-widest font-medium opacity-90 mt-2">Years of experience</p>
                                </motion.div>

                                {/* Chhoto Image - Sequential Delay */}
                                <motion.div
                                    {...fadeInUp}
                                    transition={{ ...fadeInUp.transition, delay: 0.6 }} // Aro 0.20s deri
                                    className="overflow-hidden rounded-[40px] shadow-xl h-[300px]"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400"
                                        alt="Learning"
                                        className="h-full w-full object-cover"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Side: Content --- */}
                    <div className="lg:pl-10 space-y-8">
                        <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.3 }}>
                            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-blue-600" /> About EduAll
                            </span>
                            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white mt-4 leading-[1.2]">
                                The Place Where You <br /> Can <span className="text-blue-600">Achieve</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-6 text-lg">
                                Welcome to EduAll, where learning knows no bounds. Whether you are a student, professional, or lifelong learner...
                            </p>
                        </motion.div>

                        {/* Mission & Vision with Staggered Delays */}
                        <div className="space-y-8">
                            {[
                                { icon: <BarChart3 size={28} />, title: "Our Mission", desc: "Driven by a team of dedicated educators, technologists, and visionaries." },
                                { icon: <TrendingUp size={28} />, title: "Our Vision", desc: "A professional seeking to upskill, or a lifelong learner exploring new horizons." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    {...fadeInUp}
                                    transition={{ ...fadeInUp.transition, delay: 0.5 + i * 0.2 }}
                                    className="flex gap-6"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CEO & Button - Final Delay */}
                        <motion.div
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: 0.8 }}
                            className="flex flex-wrap items-center gap-10 pt-6"
                        >
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full font-bold flex items-center gap-2 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95">
                                Read More <ArrowUpRight size={20} />
                            </button>

                            <div className="flex items-center gap-4">
                                <img src="https://i.ibb.co.com/Jw6ktQGL/541f13fb899c.jpg" alt="CEO" className="w-14 h-14 rounded-full border-2 border-blue-100 object-cover" />
                                <div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white ">Sojibur Rahman Asif</p>
                                    <p className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">CEO Of Company</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;