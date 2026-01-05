// app/layout.jsx
import './globals.css'
import { Inter } from 'next/font/google'
import DashboardWrapper from '@/app/dashboard-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Edu CRM',
  description: 'Student Lead Management for Consultants & Admins',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50`}>
       <DashboardWrapper>{children}</DashboardWrapper>
      </body>
    </html>
  )
}