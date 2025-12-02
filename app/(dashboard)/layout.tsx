"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { DashboardSidebar } from "@/components/sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    // Check if user is accessing the correct role's dashboard
    if (user && !isLoading) {
      const pathRole = pathname.split("/")[1]
      if (pathRole !== user.role) {
        router.push(`/${user.role}`)
      }
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MobileHeader />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <DashboardSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64 flex flex-col pb-16 lg:pb-0">
          <div className="flex-1 container py-6 px-4 md:px-6 lg:px-8 max-w-7xl">{children}</div>
          <Footer />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
