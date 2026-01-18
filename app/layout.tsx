"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { ShoppingAssistant } from "@/components/shopping-assistant"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { ReactQueryProvider } from "@/lib/query-client"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ReactQueryProvider>
            {!isAdminPage && <Header/>}
            <main className="flex-1">
              {children}
            </main>
            {!isAdminPage && <Footer/>}
            <Toaster />
            {!isAdminPage && <ShoppingAssistant />}
          </ReactQueryProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
