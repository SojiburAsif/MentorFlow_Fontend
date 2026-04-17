"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Phone, 
  Layout, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CircleDot,
  Cpu,
  Globe,
  LucideIcon,
  MousePointer2,
  Code2,
  Database,
  Cloud,
  Layers
} from 'lucide-react';

/**
 * Types & Interfaces
 */
interface BackgroundIcon {
  Icon: LucideIcon;
  size: number;
  initialX: string;
  initialY: string;
  duration: number;
  reverse?: boolean;
}

// ব্যাকগ্রাউন্ডের জন্য আরও কিছু আইকন এবং তাদের মোশন কনফিগ
const bgIcons: BackgroundIcon[] = [
  { Icon: Cpu, size: 40, initialX: "10%", initialY: "20%", duration: 15 },
  { Icon: Globe, size: 50, initialX: "85%", initialY: "15%", duration: 18, reverse: true },
  { Icon: Zap, size: 35, initialX: "80%", initialY: "75%", duration: 12 },
  { Icon: Sparkles, size: 45, initialX: "15%", initialY: "70%", duration: 20, reverse: true },
  { Icon: Code2, size: 30, initialX: "50%", initialY: "10%", duration: 22 },
  { Icon: Database, size: 38, initialX: "70%", initialY: "40%", duration: 16, reverse: true },
  { Icon: Cloud, size: 42, initialX: "25%", initialY: "45%", duration: 14 },
  { Icon: Layers, size: 32, initialX: "40%", initialY: "80%", duration: 19 },
];

/**
 * Animation Variants
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 20 } 
  }
};

export default function SectionHero(): React.ReactElement {
  return (
    <section className="relative px-4 py-10 md:py-20 bg-white dark:bg-[#020617] transition-colors duration-700 overflow-hidden">
      
      {/* মেইন কন্টেইনার */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative max-w-7xl mx-auto min-h-[800px] flex flex-col items-center justify-center bg-transparent"
      >
        
        {/* --- ADVANCED BACKGROUND MOTIONS --- */}
        
        {/* Dot Pattern with Pulsing Effect */}
        <motion.div 
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 dark:opacity-[0.03]"
          style={{ 
            backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)', 
            backgroundSize: '48px 48px' 
          }} 
        />

        {/* Dynamic Mesh Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Continuous Loop Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {bgIcons.map((item, i) => (
            <motion.div
              key={`bg-icon-${i}`}
              initial={{ left: item.initialX, top: item.initialY }}
              animate={{ 
                y: item.reverse ? [0, 40, 0] : [0, -40, 0],
                x: item.reverse ? [0, -20, 0] : [0, 20, 0],
                rotate: item.reverse ? [0, -15, 0] : [0, 15, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: item.duration, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ position: 'absolute' }}
              className="text-blue-500 dark:text-blue-400"
            >
              <item.Icon size={item.size} strokeWidth={1} />
            </motion.div>
          ))}
        </div>

        {/* --- CONTENT --- */}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-6"
        >
          
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-10">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/20 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 backdrop-blur-md cursor-default"
            >
              <CircleDot size={12} className="animate-pulse" />
              Intelligence that Inspires
            </motion.span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-[100px] font-medium tracking-tighter text-slate-950 dark:text-white leading-[0.95]"
          >
            Design
            <motion.span 
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center mx-4 align-middle"
            >
              <div className="w-16 h-10 md:w-32 md:h-16 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl border-t border-white/40 cursor-pointer">
                <Layout size={36} className="text-white" strokeWidth={1.5} />
              </div>
            </motion.span>
            growth with <br />
            expert
            <motion.span 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center mx-4 align-middle"
            >
              <div className="w-14 h-14 md:w-24 md:h-24 bg-gradient-to-tr from-blue-700 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 border-[6px] border-white dark:border-[#0f172a] cursor-pointer">
                <Phone size={36} className="text-white fill-current" strokeWidth={1.5} />
              </div>
            </motion.span>
            Mentorship
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="mt-12 max-w-3xl mx-auto text-slate-500 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed tracking-tight"
          >
            The world’s most ambitious founders and teams use our AI-powered 
            mentorship framework to unlock strategic clarity and accelerate 
            high-impact digital experiences.
          </motion.p>

    
          <motion.div 
            variants={fadeInUp}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="group relative px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full font-bold text-slate-900 dark:text-white transition-all hover:shadow-2xl hover:shadow-blue-500/10 active:scale-95 flex items-center gap-3 overflow-hidden">
              <span className="relative z-10">Explore Framework</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button className="px-12 py-5 bg-blue-600 text-white rounded-full font-bold shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-3">
              <Sparkles size={20} className="fill-white" />
              Book a Strategy Call
            </button>
          </motion.div>

        </motion.div>


        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-[#020617] to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}