// app/dashboard-wrapper.jsx   ← Client component - put your current layout logic here
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardWrapper({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!token || !storedUser) {
      router.replace('/login')
      return
    }

    try {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)

      // Protect /consultants route for admin only
      if (pathname === '/consultants' && parsed.role !== 'admin') {
        router.replace('/')
      }
    } catch (err) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.replace('/login')
    }
  }, [router, pathname])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              {user.role === 'admin' ? 'Admin Dashboard' : 'Consultant Dashboard'}
            </h1>
            <span className="text-sm text-gray-600">{user.username}</span>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}