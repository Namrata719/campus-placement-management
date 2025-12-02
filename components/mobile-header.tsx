"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, GraduationCap } from "lucide-react"
import { DashboardSidebar } from "./sidebar"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function MobileHeader() {
  const { user } = useAuth()

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>
      <Link href={`/${user?.role || "student"}`} className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold">PlaceMe</span>
      </Link>
    </header>
  )
}
