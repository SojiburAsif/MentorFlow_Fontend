/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Monitor,
  Users,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    title: "One-on-One Tuition",
    desc: "Personalized attention for better understanding and faster progress.",
    icon: <Users size={22} />,
  },
  {
    title: "Online Sessions",
    desc: "Live interactive classes via Google Meet, Zoom or your preferred platform.",
    icon: <Monitor size={22} />,
  },
  {
    title: "Exam Preparation",
    desc: "Targeted mock tests, revision plans and last-minute strategies.",
    icon: <BookOpen size={22} />,
  },
  {
    title: "Flexible Timing",
    desc: "Choose class slots that match your daily routine and study plan.",
    icon: <Clock size={22} />,
  },
];

export default function TutorDetails() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 py-16 space-y-20">

        {/* -------- HERO -------- */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[30px] border border-slate-200 dark:border-white/5 bg-gradient-to-br from-slate-50 to-white dark:from-[#0a0a14] dark:to-black p-8 lg:p-12 shadow-sm dark:shadow-none"
        >
          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* LEFT */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                <Sparkles size={14} />
                Premium Learning
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                Learn smarter with
                <span className="block text-blue-600 dark:text-blue-500">
                  expert mentorship
                </span>
              </h1>

              <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                Structured and focused learning system designed to boost your
                performance, confidence, and real-world understanding.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {["Verified Tutors", "Flexible Schedule", "Live Sessions"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-zinc-300"
                  >
                    <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="lg:col-span-5">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-2xl shadow-blue-600/20"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-white/20">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-black tracking-widest text-blue-100/70">
                      Learning Stats
                    </p>
                    <p className="text-sm font-bold text-white">
                      Performance Driven
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "1:1 Focus", value: "100%" },
                    { label: "Response", value: "<24h" },
                    { label: "Sessions", value: "Live" },
                    { label: "Support", value: "24/7" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white/10 border border-white/10 rounded-xl p-3"
                    >
                      <p className="text-[10px] uppercase text-blue-100/70 font-bold">
                        {item.label}
                      </p>
                      <p className="text-lg font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-between items-center bg-black/20 rounded-xl px-4 py-3 border border-white/10 text-white cursor-pointer hover:bg-black/30 transition-colors">
                  <p className="text-sm font-bold">Start Learning Today</p>
                  <ArrowRight size={18} />
                </div>
              </motion.div>
            </div>

          </div>
        </motion.section>

        {/* -------- SERVICES -------- */}
        <section>
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-500 font-black mb-2">
                Features
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Our <span className="text-blue-600 dark:text-blue-500">Services</span>
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-md md:text-right">
              Modern tutoring solutions designed to maximize your learning
              efficiency and academic success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0a0a14] hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-5">
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {service.icon}
                  </div>
                  <span className="text-xs text-slate-400 dark:text-zinc-700 font-black">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-black mb-2 text-slate-900 dark:text-white">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}