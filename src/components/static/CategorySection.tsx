/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Languages,
    Palette,
    Activity,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

const categories = [
    {
        title: "Language Learning",
        desc: "Courses teaching languages such as English, Spanish, French, Mandarin etc. Master a new language with professional guidance.",
        icon: <Languages size={32} />,
        variant: "dark",
    },
    {
        title: "Creative Arts & Design",
        desc: "Courses on graphic design, digital art, photography, video editing and more to boost your creative career.",
        icon: <Palette size={32} />,
        variant: "dark",
    },
    {
        title: "Health & Fitness",
        desc: "Courses on nutrition, fitness training, yoga, meditation, wellness coaching to keep you healthy and strong.",
        icon: <Activity size={32} />,
        variant: "blue",
    },
];

const CategorySection = () => {
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    // --- Animation Definitions (Error Fixed) ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 60,
            scale: 0.95 
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 100,
                duration: 0.8
            },
        },
    };

    const headerVariants: Variants = {
        hidden: { opacity: 0, x: -30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                type: "spring" as const, 
                stiffness: 50, 
                duration: 1 
            }
        }
    };

    return (
        <section className="py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
            <motion.div 
                className="container mx-auto px-6 max-w-7xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
            >
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <motion.div variants={headerVariants} className="max-w-3xl">
                        <span className="text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase text-sm mb-4 block">
                            Our Categories
                        </span>
                        <h2 className="text-4xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">
                            Explore 4,000+ Free <br />
                            <span className="text-blue-600 dark:text-blue-500">Online Courses</span>
                        </h2>
                        <p className="text-slate-600 dark:text-zinc-400 text-lg md:text-xl max-w-xl font-normal leading-relaxed">
                            Unlock your potential with our high-quality education catalog designed for the modern student.
                        </p>
                    </motion.div>

                    {/* Slider Controls */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4">
                        <button className="w-14 h-14 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-colors duration-300">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="w-14 h-14 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-colors duration-300">
                            <ChevronRight size={24} />
                        </button>
                    </motion.div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            onClick={() => setSelectedCategory(cat)}
                            className={`group cursor-pointer p-10 rounded-[40px] border transition-all duration-500 relative overflow-hidden flex flex-col h-full shadow-lg ${
                                cat.variant === "blue"
                                    ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/20"
                                    : "bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-blue-500/30 text-slate-900 dark:text-white hover:border-blue-500 shadow-slate-200/50 dark:shadow-none"
                            }`}
                        >
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div 
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-lg transition-all duration-300 ${
                                    cat.variant === "blue" 
                                    ? "bg-white/20 text-white backdrop-blur-md" 
                                    : "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-500 border border-slate-100 dark:border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                                }`}
                            >
                                {cat.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-4 tracking-tight">
                                {cat.title}
                            </h3>

                            <p className={`mb-10 text-base font-normal leading-relaxed flex-grow ${
                                cat.variant === "blue" ? "text-blue-50/80" : "text-slate-600 dark:text-zinc-400"
                            }`}>
                                {cat.desc}
                            </p>

                            <div className={`flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors ${
                                cat.variant === "blue" ? "text-white" : "text-blue-600 dark:text-blue-500 group-hover:text-blue-700 dark:group-hover:text-blue-400"
                            }`}>
                                Explore <ArrowRight size={20} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* --- MODAL SECTION --- */}
            <AnimatePresence>
                {selectedCategory && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCategory(null)}
                            className="absolute inset-0 bg-slate-900/60 dark:bg-black/95 backdrop-blur-md"
                        />

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0,
                                transition: { type: "spring" as const, damping: 25, stiffness: 300 } 
                            }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[40px] p-10 shadow-2xl border border-slate-200 dark:border-zinc-800"
                        >
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring" as const, delay: 0.2 }}
                                    className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-2xl"
                                >
                                    {selectedCategory.icon}
                                </motion.div>
                                <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{selectedCategory.title}</h3>
                                <p className="text-slate-600 dark:text-zinc-400 text-lg mb-10 leading-relaxed">
                                    {selectedCategory.desc}
                                </p>
                                
                                <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                                    Start Learning Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-24 opacity-30" 
            />
        </section>
    );
};

export default CategorySection;