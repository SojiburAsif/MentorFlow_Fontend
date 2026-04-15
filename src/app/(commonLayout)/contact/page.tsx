"use client";

import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form logic here
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070f] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden bg-slate-50/50 dark:bg-[#0a0a14] border-b border-slate-200 dark:border-sky-900/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Get In <span className="text-sky-600 dark:text-sky-400">Touch</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Have a question or want to work together? Drop us a message and we ll get back to you as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-sky-600 dark:text-sky-400">
              <span className="h-1 w-8 bg-current rounded-full" />
              Info
            </h2>
            
            <div className="group p-6 bg-slate-50 dark:bg-[#0d0d1a] border border-slate-200 dark:border-sky-900/15 rounded-3xl hover:border-sky-500/30 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-black/40 rounded-2xl shadow-sm text-sky-600 dark:text-sky-400">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Email Us</p>
                  <p className="font-bold text-sm">hello@yourdomain.me</p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-slate-50 dark:bg-[#0d0d1a] border border-slate-200 dark:border-sky-900/15 rounded-3xl hover:border-sky-500/30 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-black/40 rounded-2xl shadow-sm text-sky-600 dark:text-sky-400">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Call Us</p>
                  <p className="font-bold text-sm">+880 1XXX XXXXXX</p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-slate-50 dark:bg-[#0d0d1a] border border-slate-200 dark:border-sky-900/15 rounded-3xl hover:border-sky-500/30 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-black/40 rounded-2xl shadow-sm text-sky-600 dark:text-sky-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Location</p>
                  <p className="font-bold text-sm">Dinajpur, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 md:p-10 bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-sky-900/15 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-sky-500" />
                <h3 className="text-2xl font-black uppercase tracking-tight">Send a message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-sky-900/20 focus:border-sky-500 dark:focus:border-sky-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="example@mail.com"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-sky-900/20 focus:border-sky-500 dark:focus:border-sky-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Project Inquiry"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-sky-900/20 focus:border-sky-500 dark:focus:border-sky-500 outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Your Message</label>
                  <textarea 
                    rows={5}
                    placeholder="Tell us more about your project..."
                    className="w-full px-6 py-4 rounded-3xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-sky-900/20 focus:border-sky-500 dark:focus:border-sky-500 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_20px_-10px_rgba(2,132,199,0.5)] transition-all flex items-center justify-center gap-3 group"
                >
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}