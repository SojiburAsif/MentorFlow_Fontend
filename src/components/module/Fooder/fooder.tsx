"use client";

import React from "react";
import { motion } from "framer-motion";
import {
   
    Mail,
    Phone,
    GraduationCap,
    BookOpen,
    Pencil,
    AtSign,
    Send,
    ArrowUp,
    Globe,
} from "lucide-react";
import MainLogo from "@/components/shared/logo/MainLogo";

// Type-safe floating variants
const floatingVariants = {
    animate: (i: number) => ({
        y: [0, -25, 0],
        rotate: [0, 15, -15, 0],
        transition: {
            duration: 5 + i,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
        },
    }),
};

const FooterPage = () => {
    const currentYear = new Date().getFullYear();

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative bg-white dark:bg-black pt-20 pb-10 overflow-hidden border-t border-slate-100 dark:border-slate-900">
            {/* --- Floating Background Icons --- */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    custom={1}
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-10 left-[5%] text-blue-400 dark:text-blue-500 opacity-40"
                >
                    <GraduationCap size={50} strokeWidth={1.5} />
                </motion.div>

                <motion.div
                    custom={2}
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-40 right-[10%] text-orange-500 dark:text-orange-600 opacity-40"
                >
                    <BookOpen size={40} strokeWidth={1.5} />
                </motion.div>

                <motion.div
                    custom={3}
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute bottom-20 left-[15%] text-emerald-500 dark:text-emerald-600 opacity-40"
                >
                    <Pencil size={35} strokeWidth={1.5} />
                </motion.div>

                <motion.div
                    custom={4}
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-1/2 right-[5%] text-purple-500 dark:text-purple-600 opacity-40"
                >
                    <AtSign size={45} strokeWidth={1.5} />
                </motion.div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
                                <GraduationCap size={28} />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                <MainLogo></MainLogo>
                            </h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Empowering learners worldwide with expert-led courses and a supportive community to bridge the gap between skills and success.
                        </p>
                        <div className="flex gap-3">
                            {[].map((Icon, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ y: -5, backgroundColor: "#2563eb", color: "#fff" }}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all duration-300 border border-slate-200 dark:border-slate-800"
                                >
                                
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-7 uppercase tracking-widest">
                            Quick Links
                        </h4>
                        <ul className="space-y-4">
                            {["About us", "All Courses", "Instructors", "Help Center", "Blogs"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors font-medium flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-[2px] bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Details */}
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-7 uppercase tracking-widest">
                            Contact Us
                        </h4>
                        <div className="space-y-6">
                            <div className="flex gap-4 group">
                                <div className="text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform">
                                    <Phone size={20} />
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <p className="hover:text-blue-600 cursor-pointer transition-colors">+880 1840587095</p>
                                    <p className="text-xs opacity-70">Mon-Fri, 9am - 6pm</p>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <p className="hover:text-blue-600 cursor-pointer transition-colors">asif81534@gmail.com</p>
                                    <p className="text-xs opacity-70">Online Support 24/7</p>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform">
                                    <Globe size={20} />
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <p className="hover:text-blue-600 cursor-pointer transition-colors">www.skillbridge.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="relative">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-7 uppercase tracking-widest">
                            Subscribe
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[30px] border border-slate-100 dark:border-slate-800 shadow-inner">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
                                Join our community for latest updates.
                            </p>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-slate-700 rounded-full py-3 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none dark:text-white transition-all"
                                />
                                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-md active:scale-95">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 relative">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        © {currentYear}{" "}
                        <span className="text-blue-600 dark:text-blue-500 font-bold">SkillBridge</span>. All Rights Reserved.
                    </p>

                    <div className="flex gap-8 text-sm font-bold text-slate-400 dark:text-slate-600">
                        <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Terms</a>
                    </div>

                    {/* Back To Top Button */}
                    <motion.button
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="md:absolute -top-6 right-0 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 border-4 border-white dark:border-black z-20 group"
                        title="Back to Top"
                    >
                        <ArrowUp size={24} className="group-hover:animate-bounce" />
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default FooterPage;