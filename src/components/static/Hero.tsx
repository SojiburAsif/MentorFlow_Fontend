"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, Video, Code, Globe, GraduationCap } from "lucide-react";

export default function SectionHero() {
  const { scrollY } = useScroll();
  
  // স্ক্রল করলে ব্যাকগ্রাউন্ড এলিমেন্টগুলো সামান্য মুভ করবে (Parallax)
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen w-full bg-white dark:bg-black flex flex-col justify-center items-center overflow-hidden px-6 lg:px-12 transition-colors duration-500">
      
      {/* Background Glow Effect */}
      <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px]  dark:bg-blue-600/10 blur-[120px] rounded-full z-0" />

      {/* Floating Education Logos (Animated) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-30">
        {[
          { Icon: GraduationCap, top: "20%", left: "15%", delay: 0 },
          { Icon: BookOpen, top: "60%", left: "5%", delay: 1 },
          { Icon: Code, top: "15%", left: "80%", delay: 1.5 },
          { Icon: Video, top: "75%", left: "85%", delay: 0.5 },
          { Icon: Globe, top: "40%", left: "90%", delay: 2 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
            className="absolute text-blue-600 dark:text-blue-500"
            style={{ top: item.top, left: item.left }}
          >
            <item.Icon size={40} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h1 className="text-[50px] md:text-[85px] font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase">
            Master the <br /> 
            <span className="text-blue-600 dark:text-blue-500">Future of</span> <br /> 
            Learning
          </h1>

          <p className="max-w-md text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
            Elevate your skills with an immersive educational experience. Join thousands of students mastering modern technologies today.
          </p>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-8 items-start sm:items-center lg:items-start">
            <button className="group relative px-10 py-4 bg-transparent border border-blue-500/30 rounded-full overflow-hidden transition-all hover:border-blue-500">
              <span className="relative z-10 text-xs font-bold text-slate-800 dark:text-white tracking-widest uppercase">
                Start Your Journey
              </span>
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
              <div className="absolute -inset-1 bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <div className="flex items-center gap-3 ml-2">
               <div className="relative text-blue-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-current shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  <div className="absolute inset-0 w-full h-full rounded-full bg-current animate-ping opacity-50" />
               </div>
               <p className="text-[10px] font-bold text-slate-500 dark:text-white/50 tracking-[0.2em] uppercase">
                  Active Enrollment Open
               </p>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Visual Cards */}
        <motion.div 
          style={{ y: y1 }}
          className="relative flex justify-center lg:justify-end pt-12 lg:pt-0"
        >
          <div className="relative flex gap-6">
            {/* Main Visual Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative w-[280px] h-[380px] md:w-[340px] md:h-[450px] bg-slate-100 dark:bg-[#0a0a0a] rounded-[40px] border border-blue-500/10 dark:border-white/5 overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-blue-500/20 dark:from-blue-500/30 to-transparent blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] flex items-center justify-center">
                 <GraduationCap size={150} className="text-blue-600/20 dark:text-blue-500/10" strokeWidth={1} />
              </div>
              <div className="absolute bottom-10 left-8 right-8 space-y-2">
                 <div className="h-1 w-12 bg-blue-600 rounded-full" />
                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Interactive Courses</p>
              </div>
            </motion.div>

            {/* Side Card (Parallax) */}
            <motion.div 
              style={{ y: y2 }}
              className="hidden md:block relative w-[280px] h-[380px] md:w-[340px] md:h-[450px] bg-slate-100 dark:bg-[#0a0a0a] rounded-[40px] border border-blue-500/10 dark:border-white/5 opacity-40 scale-95"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute bottom-8 left-1/2 lg:left-auto lg:right-12 -translate-x-1/2 lg:translate-x-0 w-[90%] max-w-[320px] bg-slate-900 dark:bg-white rounded-3xl p-5 flex items-center justify-between z-30 shadow-2xl"
      >
        <div className="space-y-1">
          <p className="text-slate-400 dark:text-zinc-500 font-black uppercase text-[10px] tracking-tighter leading-none">
            Ready to learn?
          </p>
          <p className="text-white dark:text-black font-black uppercase text-lg tracking-tighter leading-none">
            Join Now
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white transition-transform hover:scale-110 cursor-pointer shadow-lg shadow-blue-500/40">
          <ArrowRight className="w-6 h-6" />
        </div>
      </motion.div>

    </section>
  );
}