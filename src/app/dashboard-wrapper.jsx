// app/dashboard-wrapper.jsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { AlertCircle } from 'lucide-react'

export default function DashboardWrapper({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [isChecking, setIsChecking] = useState(true)
  const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    // Skip everything if on login page
    if (pathname === '/login') {
      console.log('On login page — skipping wrapper auth check')
      setIsChecking(false)
      return
    }

    console.log('Wrapper auth check starting on:', pathname)

    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    console.log('Stored data:', { token: storedToken?.substring(0, 20) + '...', user: storedUser })

    if (!storedToken || !storedUser) {
      console.log('No token/user — redirecting to /login')
      router.replace('/login')
      setIsChecking(false)
      return
    }

    try {
      const parsed = JSON.parse(storedUser)
      console.log('Parsed user successfully:', parsed)
      if (!parsed.username || !parsed.role) {
        throw new Error('Invalid user structure')
      }
      setUser(parsed)

      if (pathname === '/consultants' && parsed.role !== 'admin') {
        console.log('Access denied — redirecting')
        router.replace('/')
      }
    } catch (err) {
      console.error('User parse failed:', err)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.replace('/login')
    } finally {
      setIsChecking(false)
    }
  }, [router, pathname])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading session...</p>
        </div>
      </div>
    )
  }

  // If no user and NOT on login → show error
  if (!user && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-red-800">Session Error</p>
          <p className="text-gray-600 mt-2">Please log in again</p>
        </div>
      </div>
    )
  }

  // Normal render
  return (
    <div className="flex min-h-screen bg-gray-50">
      {pathname !== '/login' && <Sidebar role={user?.role} />}
      <div className="flex-1 flex flex-col">
        {pathname !== '/login' && (
          <header className="bg-white shadow-sm px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Consultant Dashboard'}
              </h1>
              <span className="text-sm text-gray-600">{user?.username}</span>
            </div>
          </header>
        )}
        <main className={pathname === '/login' ? 'w-full' : 'flex-1 p-6 md:p-8'}>
          {children}
        </main>
      </div>
    </div>
  )
}
