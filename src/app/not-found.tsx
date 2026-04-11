import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-2 text-blue-600 dark:text-blue-500">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-500">Page not found</h2>
        
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Sorry, the page you are looking for doesn t exist. It might have been moved or deleted.
        </p>

        <div className="flex gap-3 justify-center flex-col sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
