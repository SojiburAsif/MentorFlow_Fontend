'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home, ShieldAlert } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // আপনি চাইলে এখানে Sentry বা কোনো এরর লগিং সার্ভিসে এররটি পাঠাতে পারেন
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-[#07070f] transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Glow Decorations (Only visible in Dark Mode) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none hidden dark:block" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none hidden dark:block" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white dark:bg-[#0d0d1a]/80 backdrop-blur-xl border border-slate-200 dark:border-blue-900/20 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-blue-500/5 text-center">
          
          {/* Animated Icon Container */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-25" />
              <div className="relative p-6 bg-red-50 dark:bg-red-500/10 rounded-full border border-red-100 dark:border-red-500/20">
                <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <h2 className="text-3xl font-black mb-3 text-slate-900 dark:text-white tracking-tight uppercase">
            Oops! <span className="text-blue-600 dark:text-blue-500">System Error</span>
          </h2>
          
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-[280px] mx-auto leading-relaxed">
            {error.message || "We've encountered an unexpected issue while processing your request."}
          </p>

          {/* Error ID Card */}
          {error.digest && (
            <div className="mb-8 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl inline-flex items-center gap-2 border border-slate-200 dark:border-white/5">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trace ID:</span>
               <code className="text-[10px] text-blue-600 dark:text-blue-400 font-bold break-all select-all">
                {error.digest}
               </code>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => reset()}
              className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <RefreshCcw size={18} />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="h-12 rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Home size={18} />
              Go Home
            </Button>
          </div>

          {/* Footer Decoration */}
          <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            <div className="h-1 w-8 rounded-full bg-slate-400" />
            <div className="h-1 w-1 rounded-full bg-slate-400" />
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          Need help? <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  )
}