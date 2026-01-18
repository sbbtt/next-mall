"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useAuth } from "@/lib/contexts/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  // 로그인 체크 (모든 로그인 사용자 접근 가능)
  React.useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  // 로그인하지 않으면 아무것도 렌더링하지 않음
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="pl-64">
        {children}
      </div>
    </div>
  )
}
