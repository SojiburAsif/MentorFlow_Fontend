import React from 'react'
import LoginForm from '@/components/module/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <LoginForm />
    </div>
  )
}
