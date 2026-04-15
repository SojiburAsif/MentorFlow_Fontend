"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Target, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const values = [
    { 
      name: "Structured Learning", 
      desc: "We provide a clear roadmap for students to master complex technologies without getting lost.",
      icon: Target 
    },
    { 
      name: "Expert Mentorship", 
      desc: "Direct access to industry professionals who have already navigated the path you're on.",
      icon: Users 
    },
    { 
      name: "Modern Stack", 
      desc: "Built with the latest technologies like Next.js and Node.js for a seamless user experience.",
      icon: Cpu 
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs tracking-widest uppercase mb-6 border border-blue-500/20 font-medium">
              <Sparkles size={12} />
              <span>About Mentorflow</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter mb-8 text-black dark:text-white leading-[0.9]">
              Empowering the <br />
              <span className="text-blue-600 italic">Next Generation.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
              Mentorflow is more than a platform; it is a bridge between ambition and expertise. We empower students to reach their full potential through structured guidance and professional mentorship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-slate-50/50 dark:bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            <motion.div {...fadeIn}>
              <h2 className="text-xs uppercase tracking-[0.4em] text-blue-600 mb-8 flex items-center gap-3 font-medium">
                <span className="h-px w-12 bg-blue-600" /> Our Vision
              </h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                <p>
                  At Mentorflow, we believe that everyone deserves access to high-quality guidance. Our mission is to democratize mentorship by connecting aspiring developers with seasoned industry leaders.
                </p>
                <p>
                  Whether you are a student starting your journey at Dinajpur Polytechnic Institute or a professional looking to scale, Mentorflow provides the flow you need to succeed.
                </p>
              </div>

              {/* Founder/Platform Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/5 shadow-sm">
                  <div className="flex items-center gap-3 text-blue-600 mb-3">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-medium uppercase tracking-tight">Reliability</span>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">Verified Mentors Only</p>
                  <p className="text-xs text-slate-500 mt-1">Quality is our core priority.</p>
                </div>
                
                <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/5 shadow-sm">
                  <div className="flex items-center gap-3 text-blue-600 mb-3">
                    <Zap size={20} />
                    <span className="text-sm font-medium uppercase tracking-tight">Speed</span>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">Instant Connectivity</p>
                  <p className="text-xs text-slate-500 mt-1">Start learning within minutes.</p>
                </div>
              </div>
            </motion.div>

            {/* Values / Why Us */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <h2 className="text-xs uppercase tracking-[0.4em] text-blue-600 mb-8 font-medium">Core Values</h2>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="group p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/5 hover:border-blue-500/40 transition-all duration-300 shadow-sm">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                        <value.icon size={20} />
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-widest text-black dark:text-white">{value.name}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders Note / Community Section */}
      <section className="py-24 border-t border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white uppercase">The Founder</h2>
            <p className="text-slate-500 mt-3 font-medium italic">Crafted with passion by Sojibur Rahman Asif.</p>
          </div>

          <div className="p-10 md:p-16 rounded-[3rem] bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-12 items-center">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-blue-600 shrink-0 overflow-hidden relative group">
                {/* Optional: Add founder image here */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-semibold">
                   S
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <GraduationCap className="text-white" size={40} />
                </div>
            </div>
            <div className="flex-1">
               <h4 className="text-2xl font-semibold text-black dark:text-white mb-4 italic">I built Mentorflow to provide the guidance I wished I had when I started.</h4>
               <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                 As a Full Stack Developer and a final-year student at Dinajpur Polytechnic Institute, I understand the challenges of modern learning. Mentorflow is my contribution to the tech community—a platform built on the latest MERN stack technologies to ensure smooth, efficient, and reliable mentorship.
               </p>
               <div className="flex items-center gap-4 text-sm text-blue-600 font-medium">
                  <MapPin size={16} />
                  <span>Based in Dinajpur, Bangladesh</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-black dark:bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden group shadow-2xl">
            <h3 className="text-3xl md:text-6xl font-semibold text-white uppercase tracking-tighter mb-8 relative z-10">
              Join the <span className="text-blue-500 italic">flow.</span>
            </h3>
            <p className="max-w-lg mx-auto mb-10 text-slate-400 font-medium relative z-10">
              Whether you are here to learn or to lead, Mentorflow is the place where your growth story begins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="px-10 py-4 bg-blue-600 text-white font-medium uppercase tracking-[0.2em] text-xs rounded-full hover:bg-blue-500 transition-all">
                Become a Mentor
              </button>
              <button className="px-10 py-4 bg-transparent border border-white/20 text-white font-medium uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white hover:text-black transition-all inline-flex items-center gap-2 justify-center">
                Start Learning
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}