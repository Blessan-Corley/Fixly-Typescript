'use client'

import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { CookieConsent } from '@/components/ui/cookie-consent'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Subtle background elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-slate-200 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-slate-300 rounded-full blur-3xl" />
      </div>

      {/* Enhanced Dynamic Header */}
      <Header />
      
      {/* Main Content with proper spacing for fixed header */}
      <main className="pt-20 relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Cookie Consent Popup */}
      <CookieConsent />
    </div>
  )
}