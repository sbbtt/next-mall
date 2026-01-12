import type React from "react"
import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title: "Apple Furniture - Modern E-Commerce",
  description: "Discover timeless design for your modern home",
  generator: "v0.app",
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ReactQueryProvider>
            <Header/>
            <main className="flex-1">
              {children}
            </main>
            <Footer/>
            <Toaster />
            <ShoppingAssistant />
          </ReactQueryProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
