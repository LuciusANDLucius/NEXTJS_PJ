// src/app/layout.jsx
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'Shop quần áo online',
  description: 'Hướng dẫn Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-slate-50" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}