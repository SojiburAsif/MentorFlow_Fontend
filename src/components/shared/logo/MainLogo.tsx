// components/logo/MainLogo.tsx
import React from 'react'

export default function MainLogo() {
  return (
    <div className="flex items-center gap-0">
      {/* Logo Image */}
      <img 
        src="/logo.png" 
        alt="Logo" 
        className="h-14 w-14 object-contain" 
      />
      
      {/* Text Section: Ekdom ghashe thakar jonno leading-none ebong negative margin */}
      <div className="flex flex-col justify-center select-none">
        <span className="text-[17px] font-black uppercase tracking-tighter text-blue-600 dark:text-blue-500 leading-[1] -mb-[1px]">
          Mentor
        </span>
        <span className="text-[17px] font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-[1]">
          Flow
        </span>
      </div>
    </div>
  )
}