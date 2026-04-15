'use client'

import { Button } from '@/components/ui/button'
import { FileQuestion, Home, LifeBuoy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-[#07070f] transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none hidden dark:block" />
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none hidden dark:block" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white dark:bg-[#0d0d1a]/80 backdrop-blur-2xl border border-slate-200 dark:border-blue-900/20 rounded-[3rem] p-10 sm:p-16 shadow-2xl shadow-blue-500/5 text-center">
          
          {/* Main Visual Component */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse blur-xl" />
              <div className="relative p-8 bg-blue-50 dark:bg-blue-600/10 rounded-full border border-blue-100 dark:border-blue-500/20 group">
                <FileQuestion className="h-16 w-16 text-blue-600 dark:text-blue-500 transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
          </div>
          
          {/* 404 Header */}
          <div className="mb-6">
            <h1 className="text-8xl font-black text-slate-900 dark:text-white tracking-tighter opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
              404
            </h1>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase relative z-10">
              Lost in <span className="text-blue-600 dark:text-blue-500 text-glow">Space?</span>
            </h2>
          </div>
          
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-10 max-w-[320px] mx-auto leading-relaxed">
            The page you are looking for has vanished into thin air or moved to a different dimension.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <Link href="/">
                <Home size={18} />
                Back to Home
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.back()}
              className="h-14 px-8 rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </Button>
          </div>

          {/* Secondary Action */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors"
            >
              <LifeBuoy size={14} />
              Report a missing page
            </Link>
          </div>
        </div>

        {/* Floating Branding / Footer */}
        <p className="mt-10 text-center text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
          Error Code: 404 // Page Not Found
        </p>
      </div>
      
      {/* Decorative Text in background */}
      <div className="absolute bottom-10 right-10 text-[12vw] font-black text-slate-900/[0.02] dark:text-white/[0.02] select-none pointer-events-none uppercase">
        Empty
      </div>
    </div>
  )
}